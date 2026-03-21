import os
import json
from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai  

from database import get_session
from interview_models import InterviewSession, InterviewTurn

router = APIRouter(prefix="/api/interview", tags=["Interview"])

class StartInterviewRequest(BaseModel):
    user_id: int
    job_role: str
    interview_type: str  
    skill_level: str 

class ChatMessage(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    session_id: int
    user_input: str
    history: List[ChatMessage] 

class EndSessionRequest(BaseModel):
    session_id: int

@router.post("/start")
async def start_interview(req: StartInterviewRequest, db: Session = Depends(get_session)):
    try:
        api_key = os.getenv("GEMINI_API_KEY_INTERVIEW") or os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)

        new_session = InterviewSession(
            user_id=req.user_id,
            job_role=req.job_role,
            interview_type=req.interview_type,
            difficulty=req.skill_level, 
            topic="General",
            start_time=datetime.utcnow()
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

        # Standard First Question
        prompt = f"""
        You are an expert hiring manager conducting a {req.interview_type} interview for a {req.job_role} position. The candidate's skill level is {req.skill_level}.
        Start the interview by welcoming the candidate and immediately asking exactly: "Could you please introduce yourself and tell me about your background?"
        Keep it natural, professional, and under 25 words. Do NOT include any filler text.
        """
        
        response = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        ai_text = response.text.strip()
        
        first_turn = InterviewTurn(
            session_id=new_session.id, question_text=ai_text, turn_number=1, question_type=req.interview_type
        )
        db.add(first_turn)
        db.commit()

        return {"session_id": new_session.id, "message": ai_text, "turn_number": 1}

    except Exception as e:
        print(f"Start Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def interview_chat(req: InterviewRequest, db: Session = Depends(get_session)):
    """Conversational interviewer with SMART dynamic topic shifting."""
    try:
        api_key = os.getenv("GEMINI_API_KEY_INTERVIEW") or os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)

        session = db.query(InterviewSession).filter(InterviewSession.id == req.session_id).first()
        turn_count = db.query(InterviewTurn).filter(InterviewTurn.session_id == req.session_id).count()

        last_turn = db.query(InterviewTurn).filter(InterviewTurn.session_id == req.session_id).order_by(InterviewTurn.turn_number.desc()).first()
        if last_turn and not last_turn.user_answer_text:
            last_turn.user_answer_text = req.user_input
            db.commit()

        # Grab recent history
        history_text = "\n".join([f"{msg.role}: {msg.content}" for msg in req.history[-6:]]) 
        
        # 🔥 THE FIX: A highly strict prompt that forces topic rotation and handles "I don't know" gracefully
        prompt = f"""
        You are a hiring manager conducting a {session.interview_type} interview for a {session.job_role} role. Candidate level: {session.difficulty}.
        
        Conversation History (Turn {turn_count}):
        {history_text}
        Candidate's Latest Answer: "{req.user_input}"
        
        CRITICAL INTERVIEW FLOW RULES:
        1. DYNAMIC TOPIC SHIFTING: A real interview covers many subjects. If the last 1-2 questions were about a specific tool or concept, your NEXT question MUST be about a completely different core domain. Cycle through these topics: [Projects, OOPs concepts, Databases/SQL, Data Structures & Algorithms, Networking/OS, Scenario-based problem solving].
        2. HANDLING "DON'T KNOW": If the candidate says "I don't know", "dk", or asks to change the topic, IMMEDIATELY say "No problem, let's move on to..." and ask a brand new question from a DIFFERENT core topic. NEVER try to teach them, simplify the question, or ask about the same topic again.
        3. AVOID DEEP DRILLING: Never ask more than one follow-up question on the exact same detail. Test for breadth of knowledge.
        4. Make it sound exactly like a real human speaking. Keep your response under 40 words.
        
        Based on the rules above, generate your next interview question:
        """

        response = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        next_q = response.text.strip()

        new_turn = InterviewTurn(
            session_id=session.id, question_text=next_q, turn_number=turn_count + 1, question_type=session.interview_type
        )
        db.add(new_turn)
        db.commit()

        return {"next_question": next_q, "is_final": False}

    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/evaluate")
async def evaluate_interview(req: EndSessionRequest, db: Session = Depends(get_session)):
    """Generates the EXACT requested post-interview report format."""
    try:
        api_key = os.getenv("GEMINI_API_KEY_INTERVIEW") or os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)

        session = db.query(InterviewSession).filter(InterviewSession.id == req.session_id).first()
        turns = db.query(InterviewTurn).filter(InterviewTurn.session_id == req.session_id).order_by(InterviewTurn.turn_number.asc()).all()

        transcript = ""
        for t in turns:
            transcript += f"Interviewer: {t.question_text}\n"
            if t.user_answer_text:
                transcript += f"Candidate: {t.user_answer_text}\n\n"

        prompt = f"""
        Analyze this {session.interview_type} interview transcript for a {session.job_role} position.
        
        TRANSCRIPT:
        {transcript}
        
        Generate a STRICT JSON evaluation matching this exact schema:
        {{
            "overall": {{
                "score": <0-100 integer>,
                "communication": <0-10 integer>,
                "technical": <0-10 integer>,
                "confidence": <0-10 integer>,
                "problem_solving": <0-10 integer>,
                "suggestions": "3-4 sentences of overall actionable feedback to improve."
            }},
            "per_question_analysis": [
                {{
                    "question": "The question text",
                    "candidate_answer": "The candidate's text",
                    "metrics": {{
                        "clarity": <0-10>,
                        "technical_accuracy": <0-10>,
                        "confidence": <0-10>,
                        "communication_skills": <0-10>,
                        "completeness": <0-10>
                    }},
                    "feedback": "Specific feedback for this answer",
                    "suggested_answer": "How they should have answered perfectly"
                }}
            ]
        }}
        """

        response = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        clean_json = response.text.replace("```json", "").replace("```", "").strip()
        report_data = json.loads(clean_json)

        # Save to DB
        session.end_time = datetime.utcnow()
        session.overall_score = report_data["overall"]["score"]
        session.communication_score = report_data["overall"]["communication"]
        session.technical_score = report_data["overall"]["technical"]
        session.confidence_score = report_data["overall"]["confidence"]
        session.problem_solving_score = report_data["overall"]["problem_solving"]
        session.feedback_summary = json.dumps(report_data)
        db.commit()

        return report_data

    except Exception as e:
        print(f"Eval Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate evaluation.")