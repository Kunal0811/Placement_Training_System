# backend/aptitude_routes.py
import os
import asyncio
import random
from fastapi import APIRouter, Body, HTTPException
import google.generativeai as genai
from pydantic import BaseModel

# --- Helper Functions (could be in a utils.py) ---
def generate_prompt(topic: str, count: int, difficulty: str | None = None) -> str:
    difficulty_line = f"Difficulty: {difficulty}." if difficulty else ""
    return f"""
    Generate exactly {count} multiple choice questions (MCQs) on the topic: {topic}.
    {difficulty_line}
    Return STRICT JSON (no markdown, no text outside JSON) as a list of objects with fields:
    - "question" (string)
    - "options" (array of exactly 4 distinct strings)
    - "answer" (one of the options, string)
    - "explanation" (string explaining why the answer is correct in 2–3 lines)
    """

def parse_mcqs(raw: str, count: int):
    import re, json
    m = re.search(r"\[\s*\{.*?\}\s*\]", raw, re.S)
    if not m:
        m2 = re.search(r"\{.*\}", raw, re.S)
        if m2: arr_text = "[" + m2.group(0) + "]"
        else: return []
    else:
        arr_text = m.group(0)
    try: data = json.loads(arr_text)
    except json.JSONDecodeError: return []
    cleaned = []
    for q in data:
        if (isinstance(q.get("question"), str) and isinstance(q.get("options"), list) and 
            len(q["options"]) == 4 and isinstance(q.get("answer"), str) and q["answer"] in q["options"]):
            cleaned.append({k: q.get(k, "") for k in ["question", "options", "answer", "explanation"]})
    return cleaned[:count]

# UPDATED: Now accepts an api_key argument
async def generate_single_topic(topic: str, count: int, difficulty: str, api_key: str = None):
    try:
        # Configure the key specifically for this request/module
        if api_key:
            genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = generate_prompt(topic, count, difficulty)
        resp = await model.generate_content_async(prompt)
        raw = resp.text or ""
        return parse_mcqs(raw, count)
    except Exception as e:
        print(f"Error generating questions for topic {topic}: {e}")
        return []

# --- Router Setup ---
router = APIRouter(prefix="/api/aptitude", tags=["Aptitude"])

class MCQRequest(BaseModel):
    topic: str
    count: int = 20
    difficulty: str | None = None

@router.post("/mcqs/test")
async def generate_aptitude_test(req: MCQRequest):
    # Fetch the Aptitude-specific key
    aptitude_key = os.getenv("GEMINI_API_KEY_APTITUDE")

    if req.topic == "Final Aptitude Test":
        try:
            tasks = [
                generate_single_topic("Quantitative Aptitude", 20, "hard", aptitude_key),
                generate_single_topic("Logical Reasoning", 15, "hard", aptitude_key),
                generate_single_topic("Verbal Ability", 15, "hard", aptitude_key),
            ]
            results = await asyncio.gather(*tasks)
            all_mcqs = [mcq for result in results for mcq in result]
            if not all_mcqs: raise Exception("No questions generated.")
            random.shuffle(all_mcqs)
            return all_mcqs
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Final test generation error: {e}")

    try:
        mcqs = await generate_single_topic(req.topic, req.count, req.difficulty, aptitude_key)
        if not mcqs: raise HTTPException(status_code=500, detail="Failed to generate valid test questions")
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class NoteRequest(BaseModel):
    topic: str