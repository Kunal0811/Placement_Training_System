import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import base64
import json

router = APIRouter(prefix="/api/interview", tags=["Interview"])

class ChatMessage(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    history: List[ChatMessage]
    user_input: str
    image: Optional[str] = None
    interview_type: str  # "Technical" or "HR"
    topic: str           # This will now be the User-provided Job Role

@router.post("/chat")
async def interview_chat(req: InterviewRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # Calculate progress based on history (approx 2 messages per turn)
        turn_count = (len(req.history) // 2) + 1

        system_instruction = f"""
        You are an expert {req.interview_type} interviewer for the position of: {req.topic}.
        Conduct a realistic video interview. Current Turn: {turn_count}/15.

        STRICT RULES:
        1. PROGRESS: Aim for 10-15 questions. On turn 15, set "is_final": true.
        2. CODING: If this is a Technical interview and you want the user to write code, include "CODE_TASK:" at the start of "next_question".
        3. EVALUATION: For the user's last answer, provide a score (0-10) and the "ideal_answer" (what they should have said).
        4. VOICE OPTIMIZATION: Keep "next_question" concise for text-to-speech.

        Response Format (STRICT JSON):
        {{
            "feedback": "Evaluation of previous answer.",
            "ideal_answer": "Detailed correct/better version of the answer.",
            "expression_analysis": "Analysis of facial expression/confidence.",
            "next_question": "Your next question.",
            "score": 8,
            "is_final": false
        }}
        """

        content_parts = [system_instruction]
        for msg in req.history:
            content_parts.append(f"{msg.role}: {msg.content}")
        
        content_parts.append(f"Candidate Answer: {req.user_input}")

        if req.image:
            if "base64," in req.image:
                req.image = req.image.split("base64,")[1]
            content_parts.append({"mime_type": "image/jpeg", "data": base64.b64decode(req.image)})

        response = await model.generate_content_async(content_parts)
        
        # Clean and parse JSON response
        raw_text = response.text.replace("```json", "").replace("```", "").strip()
        return {"response": raw_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))