# backend/interview_routes.py
import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

# Import Database dependencies
from database import get_session
from interview_models import InterviewSession, InterviewTurn

router = APIRouter(prefix="/api/interview", tags=["Interview"])

# --- Pydantic Models ---
class StartInterviewRequest(BaseModel):
    user_id: int
    job_role: str
    interview_type: str  # "Technical" or "HR"
    topic: str           # Specific topic or "General"

class ChatMessage(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    session_id: int
    user_input: str
    history: List[ChatMessage] # For context window
    is_code: bool = False

# --- Routes ---

@router.post("/start")
async def start_interview(req: StartInterviewRequest, db: Session = Depends(get_session)):
    """Initializes a new interview session in the database."""
    try:
        # Create Session Record
        new_session = InterviewSession(
            user_id=req.user_id,
            job_role=req.job_role,
            interview_type=req.interview_type,
            difficulty="Medium", # Default
            topic=req.topic,
            start_time=datetime.utcnow()
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

        # Generate Initial Greeting
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        You are an expert {req.interview_type} interviewer for the role of {req.job_role}.
        Start the interview by introducing yourself and asking the first question.
        Keep it professional but encouraging.
        """
        response = await model.generate_content_async(prompt)
        
        # Save first turn (AI Question)
        first_turn = InterviewTurn(
            session_id=new_session.id,
            question_text=response.text,
            turn_number=1,
            question_type=req.interview_type
        )
        db.add(first_turn)
        db.commit()

        return {
            "session_id": new_session.id, 
            "message": response.text,
            "turn_number": 1
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat")
async def interview_chat(req: InterviewRequest, db: Session = Depends(get_session)):
    """Handles the interview loop: Evaluates answer -> Saves -> Generates Next Question."""
    try:
        # 1. Fetch Session
        session = db.query(InterviewSession).filter(InterviewSession.id == req.session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")

        # 2. Update Previous Turn (User's Answer)
        last_turn = db.query(InterviewTurn).filter(InterviewTurn.session_id == req.session_id).order_by(InterviewTurn.turn_number.desc()).first()
        
        if last_turn and not last_turn.user_answer_text:
            last_turn.user_answer_text = req.user_input

        # 3. Determine Progress
        turn_count = db.query(InterviewTurn).filter(InterviewTurn.session_id == req.session_id).count()
        is_final_turn = turn_count >= 10  # Set limit to 10-15 questions

        # 4. Construct Gemini Prompt
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        system_instruction = f"""
        You are conducting a {session.interview_type} interview for {session.job_role}.
        Current Turn: {turn_count}/10.
        
        TASK:
        1. Analyze the candidate's last answer ("{req.user_input}").
        2. Provide a Score (0-10), Feedback, and the Ideal Answer.
        3. Generate the NEXT question.
        4. If {session.interview_type} == "Technical", occasionally ask for code snippets. If you want code, prepend "CODE_TASK:" to the question.
        5. If turn_count >= 10, set "is_final": true and provide a closing statement instead of a question.

        RESPONSE JSON FORMAT:
        {{
            "feedback": "Analysis of their answer...",
            "ideal_answer": "The perfect response would be...",
            "score": 8,
            "next_question": "The next question...",
            "is_final": {str(is_final_turn).lower()}
        }}
        """

        # Provide context
        history_text = "\n".join([f"{msg.role}: {msg.content}" for msg in req.history[-6:]]) # Last 3 turns context
        full_prompt = f"{system_instruction}\n\nConversation History:\n{history_text}\n\nCandidate's Last Answer: {req.user_input}"

        # 5. Generate AI Response
        ai_response = await model.generate_content_async(full_prompt)
        text_resp = ai_response.text.replace("```json", "").replace("```", "").strip()
        
        try:
            data = json.loads(text_resp)
        except:
            # Fallback if JSON fails
            data = {
                "feedback": "Good attempt.", 
                "ideal_answer": "N/A", 
                "score": 5, 
                "next_question": ai_response.text, 
                "is_final": is_final_turn
            }

        # 6. Save Evaluation to Previous Turn
        if last_turn:
            last_turn.ai_score = data.get("score")
            last_turn.ai_feedback = data.get("feedback")
            last_turn.ai_suggested_answer = data.get("ideal_answer")
        
        # 7. Create Next Turn (if not over) OR Close Session
        if data.get("is_final"):
            session.end_time = datetime.utcnow()
            # Calculate Average Score
            avg_score = db.query(InterviewTurn).with_entities(InterviewTurn.ai_score).filter(InterviewTurn.session_id==session.id).all()
            total = sum([x[0] for x in avg_score if x[0]])
            count = len(avg_score)
            session.overall_score = round(total/count, 1) if count > 0 else 0
            session.feedback_summary = f"Interview Completed. Final Score: {session.overall_score}/10"
        else:
            new_turn = InterviewTurn(
                session_id=session.id,
                question_text=data.get("next_question"),
                turn_number=turn_count + 1,
                question_type="Technical" if "CODE_TASK:" in data.get("next_question", "") else "Behavioral"
            )
            db.add(new_turn)

        db.commit()

        return data

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))