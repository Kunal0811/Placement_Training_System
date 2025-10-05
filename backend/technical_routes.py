# backend/technical_routes.py
import os
import asyncio
import random
from fastapi import APIRouter, Body, HTTPException
import google.generativeai as genai
from pydantic import BaseModel

# CHANGE THIS LINE: Remove the dot from ".aptitude_routes"
from aptitude_routes import generate_prompt, parse_mcqs, generate_single_topic

# --- Router Setup ---
router = APIRouter(prefix="/api/technical", tags=["Technical"])

class TechnicalMCQRequest(BaseModel):
    topic: str
    count: int = 20
    difficulty: str | None = None

@router.post("/mcqs/test")
async def generate_technical_test(req: TechnicalMCQRequest):
    try:
        mcqs = await generate_single_topic(req.topic, req.count, req.difficulty)
        if not mcqs:
            raise HTTPException(status_code=500, detail="Failed to generate valid technical test questions")
        random.shuffle(mcqs)
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))