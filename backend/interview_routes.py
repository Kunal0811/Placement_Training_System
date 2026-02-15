# backend/interview_routes.py
import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime
from database import get_cursor

# Import Database dependencies
from database import get_session
from interview_models import InterviewSession, InterviewTurn

router = APIRouter(prefix="/api/interview", tags=["Interview"])

# ... (Pydantic Models remain unchanged) ...
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

# --- Routes ---

@router.post("/start")
async def start_interview(req: StartInterviewRequest, db: Session = Depends(get_session)):
    """Initializes a new interview session in the database."""
    try:
        # CONFIGURE KEY FOR INTERVIEW
        genai.configure(api_key=os.getenv("GEMINI_API_KEY_INTERVIEW"))

        # Create Session Record
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

        # Generate Initial Greeting
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"""
        You are a hiring manager for the {req.job_role} position. 
        Start the interview now.
        
        STRICT RULES:
        1. Keep your greeting under 15 words.
        2. Your FIRST question MUST be: "Please introduce yourself and tell me a bit about your background."
        3. Do not ask multiple questions at once.
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
        # CONFIGURE KEY FOR INTERVIEW
        genai.configure(api_key=os.getenv("GEMINI_API_KEY_INTERVIEW"))

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
            You are conducting a {session.interview_type} interview for the {session.job_role} role.
            Current Progress: Question {turn_count} of 15.

            DIFFICULTY LOGIC:
            - Turns 1-3: Basic/Introductory level.
            - Turns 4-8: Intermediate level (Scenario-based or core technical concepts).
            - Turns 9-13: Advanced/Hard level (Complex problem solving or architecture).
            - Turns 14-15: Closing and final thoughts.

            STRICT RULES:
            1. Ask ONLY ONE question at a time.
            2. Keep questions concise (under 30 words) to facilitate voice interaction.
            3. Increase the technical complexity as the interview progresses based on the "DIFFICULTY LOGIC" above.
            4. If the turn_count reaches 15, set "is_final": true.

            RESPONSE JSON FORMAT:
            {{
                "feedback": "...",
                "ideal_answer": "...",
                "score": 0-10,
                "next_question": "...",
                "is_final": false
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