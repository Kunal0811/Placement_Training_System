import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import base64

router = APIRouter(prefix="/api/interview", tags=["Interview"])

class ChatMessage(BaseModel):
    role: str
    content: str

class InterviewRequest(BaseModel):
    history: List[ChatMessage]
    user_input: str
    image: Optional[str] = None # Base64 encoded image
    interview_type: str
    topic: str

@router.post("/chat")
async def interview_chat(req: InterviewRequest):
    try:
        # Use Gemini 1.5 Flash for speed and multimodal capabilities
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        system_instruction = f"""
        You are an expert {req.interview_type} interviewer conducting a video interview. 
        Topic: {req.topic}.
        
        Input:
        1. The candidate's spoken answer (transcribed text).
        2. A snapshot of the candidate's face during the answer.

        Your Task:
        1. Analyze the Candidate's Facial Expression: Are they confident, nervous, smiling, serious?
        2. Evaluate the Answer: Is it correct? clear?
        3. Provide the Next Question.

        Response Format (Strict JSON):
        {{
            "feedback": "Brief feedback on their answer.",
            "expression_analysis": "Observation about their body language/facial expression.",
            "next_question": "The next question to ask.",
            "score": "Current rating out of 10 based on this turn."
        }}
        """

        # Prepare content for Gemini
        content_parts = []
        
        # 1. Add context/history
        context_prompt = f"{system_instruction}\n\nChat History:\n"
        for msg in req.history:
            context_prompt += f"{msg.role}: {msg.content}\n"
        
        content_parts.append(context_prompt)

        # 2. Add the User's Input
        content_parts.append(f"Candidate Answer: {req.user_input}")

        # 3. Add the Image if provided
        if req.image:
            try:
                # Remove header if present (e.g., "data:image/jpeg;base64,")
                if "base64," in req.image:
                    req.image = req.image.split("base64,")[1]
                
                image_data = base64.b64decode(req.image)
                content_parts.append({
                    "mime_type": "image/jpeg",
                    "data": image_data
                })
            except Exception as img_err:
                print(f"Image processing error: {img_err}")
                # Continue without image if it fails

        # Generate response
        response = await model.generate_content_async(content_parts)
        
        # Extract JSON from response (Gemini sometimes wraps in ```json ... ```)
        text_resp = response.text.replace("```json", "").replace("```", "").strip()
        
        return {"response": text_resp}

    except Exception as e:
        print(f"Interview Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))