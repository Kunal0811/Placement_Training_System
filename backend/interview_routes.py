# backend/interview_routes.py
import os
import json
from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from google import genai  # ✅ Using the NEW SDK

# Database & Models
from database import get_session, get_cursor
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
    history: List[ChatMessage] 
    is_code: bool = False

class SaveInterviewRequest(BaseModel):
    user_id: int
    interview_type: str
    job_role: str
    overall_score: int
    feedback: list 

class EndSessionRequest(BaseModel):
    session_id: int

# --- Routes ---

@router.post("/save-attempt")
def save_interview_attempt(req: SaveInterviewRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        feedback_json = json.dumps(req.feedback)
        query = """
            INSERT INTO interview_attempts (user_id, interview_type, job_role, overall_score, feedback)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (req.user_id, req.interview_type, req.job_role, req.overall_score, feedback_json))
        db.commit()
        return {"message": "Interview results saved successfully"}
    except Exception as e:
        print(f"Error saving interview: {e}")
        raise HTTPException(status_code=500, detail="Failed to save results")

@router.post("/start")
async def start_interview(req: StartInterviewRequest, db: Session = Depends(get_session)):
    """Initializes a new interview session in the database."""
    try:
        # 1. Get API Key
        api_key = os.getenv("GEMINI_API_KEY_INTERVIEW")
        if not api_key:
            api_key = os.getenv("GEMINI_API_KEY") # Fallback
        
        if not api_key:
            raise HTTPException(status_code=500, detail="Missing API Key for Interview.")

        # 2. Initialize Client
        client = genai.Client(api_key=api_key)

        # 3. Create Session Record
        new_session = InterviewSession(
            user_id=req.user_id,
            job_role=req.job_role,
            interview_type=req.interview_type,
            difficulty="Medium", 
            topic=req.topic,
            start_time=datetime.utcnow()
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

        # 4. Generate Initial Greeting
        prompt = f"""
        You are a hiring manager for the {req.job_role} position. 
        Start the interview now.
        
        STRICT RULES:
        1. Keep your greeting under 15 words.
        2. Your FIRST question MUST be: "Please introduce yourself and tell me a bit about your background."
        3. Do not ask multiple questions at once.
        """
        
        # ✅ Using gemini-2.5-flash
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash", 
            contents=prompt
        )
        
        # 5. Save first turn (AI Question)
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
        print(f"❌ Start Interview Error (Likely Quota/Model Issue): {e}") 
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

@router.post("/chat")
async def interview_chat(req: InterviewRequest, db: Session = Depends(get_session)):
    """Handles the interview loop: Evaluates answer -> Saves -> Generates Next Question."""
    try:
        api_key = os.getenv("GEMINI_API_KEY_INTERVIEW") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Missing API Key for Interview.")

        client = genai.Client(api_key=api_key)

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
        is_final_turn = turn_count >= 10  # Ends at 10 questions

        # 4. Construct Gemini Prompt
        system_instruction = f"""
            You are conducting a {session.interview_type} interview for the {session.job_role} role.
            Current Progress: Question {turn_count} of 10.

            DIFFICULTY LOGIC:
            - Turns 1-3: Basic/Introductory level.
            - Turns 4-7: Intermediate level (Scenario-based or core technical concepts).
            - Turns 8-9: Advanced/Hard level (Complex problem solving).
            - Turn 10: Closing and final thoughts.

            STRICT RULES:
            1. Ask ONLY ONE question at a time.
            2. Keep questions concise (under 30 words) to facilitate voice interaction.
            3. Increase the technical complexity as the interview progresses.
            4. If the turn_count reaches 10, set "is_final": true.

            RESPONSE JSON FORMAT:
            {{
                "feedback": "...",
                "ideal_answer": "...",
                "score": 0-10,
                "next_question": "...",
                "is_final": false
            }}
        """

        history_text = "\n".join([f"{msg.role}: {msg.content}" for msg in req.history[-6:]]) 
        full_prompt = f"{system_instruction}\n\nConversation History:\n{history_text}\n\nCandidate's Last Answer: {req.user_input}"

        # 5. Generate AI Response
        # ✅ Using gemini-2.5-flash
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        
        # Clean Markdown if present
        text_resp = response.text.replace("```json", "").replace("```", "").strip()
        
        try:
            data = json.loads(text_resp)
        except:
            data = {
                "feedback": "Good attempt.", 
                "ideal_answer": "N/A", 
                "score": 5, 
                "next_question": response.text, 
                "is_final": is_final_turn
            }

        # 6. Save Evaluation to Previous Turn
        if last_turn:
            last_turn.ai_score = data.get("score")
            last_turn.ai_feedback = data.get("feedback")
            last_turn.ai_suggested_answer = data.get("ideal_answer")
        
        # 7. Create Next Turn OR Close Session
        if data.get("is_final"):
            session.end_time = datetime.utcnow()
            avg_score = db.query(InterviewTurn).with_entities(InterviewTurn.ai_score).filter(InterviewTurn.session_id==session.id).all()
            if avg_score:
                valid_scores = [x[0] for x in avg_score if x[0] is not None]
                session.overall_score = round(sum(valid_scores) / len(valid_scores), 1) if valid_scores else 0
            
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
        print(f"❌ Chat Error (Likely Quota/Model Issue): {e}")
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

@router.post("/end")
def end_interview_session(req: EndSessionRequest, db: Session = Depends(get_session)):
    """Manually ends an interview session and calculates the partial score."""
    try:
        session = db.query(InterviewSession).filter(InterviewSession.id == req.session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Only close it if it hasn't been closed yet
        if session.end_time is None:
            session.end_time = datetime.utcnow()
            
            # Calculate average score based on completed turns so far
            avg_score = db.query(InterviewTurn).with_entities(InterviewTurn.ai_score).filter(InterviewTurn.session_id==session.id).all()
            if avg_score:
                valid_scores = [x[0] for x in avg_score if x[0] is not None]
                session.overall_score = round(sum(valid_scores) / len(valid_scores), 1) if valid_scores else 0
            else:
                session.overall_score = 0
                
            session.feedback_summary = f"Interview Ended Early. Partial Score: {session.overall_score}/10"
            db.commit()

        return {"message": "Session ended successfully"}
    except Exception as e:
        print(f"End Session Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))