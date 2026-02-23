# backend/technical_routes.py
import os
import asyncio
import random
from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from aptitude_routes import generate_single_topic

# --- Router Setup ---
router = APIRouter(prefix="/api/technical", tags=["Technical"])

class TechnicalMCQRequest(BaseModel):
    topic: str
    count: int = 20
    difficulty: str | None = None

@router.post("/mcqs/test")
async def generate_technical_test(req: TechnicalMCQRequest):
    try:
        # Fetch the Technical-specific key
        technical_key = os.getenv("GEMINI_API_KEY_TECHNICAL")
        
        # Pass the key to the shared function
        mcqs = await generate_single_topic(req.topic, req.count, req.difficulty, technical_key)
        
        if not mcqs:
            raise HTTPException(status_code=500, detail="Failed to generate valid technical test questions")
        random.shuffle(mcqs)
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))