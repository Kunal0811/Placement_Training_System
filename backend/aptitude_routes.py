# backend/aptitude_routes.py
import os
import asyncio
import random
from fastapi import APIRouter, Body, HTTPException
from google import genai  # UPDATED IMPORT
from pydantic import BaseModel

# --- Helper Functions ---
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
    
    try: 
        data = json.loads(arr_text)
    except json.JSONDecodeError: 
        print(f"JSON Decode Error. Raw text: {raw[:100]}...")
        return []
        
    cleaned = []
    for q in data:
        if (isinstance(q.get("question"), str) and isinstance(q.get("options"), list) and 
            len(q["options"]) == 4 and isinstance(q.get("answer"), str)):
            if q["answer"] not in q["options"]: continue 
            cleaned.append({k: q.get(k, "") for k in ["question", "options", "answer", "explanation"]})
            
    return cleaned[:count]

# UPDATED: Using new google-genai Client
async def generate_single_topic(topic: str, count: int, difficulty: str, api_key: str = None):
    try:
        if not api_key:
            print("⚠️ Warning: No API Key provided")
            return []

        # NEW SDK USAGE
        client = genai.Client(api_key=api_key)
        
        prompt = generate_prompt(topic, count, difficulty)
        
        # 'client.aio' is the async interface
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        raw = response.text or ""
        parsed = parse_mcqs(raw, count)
        
        if not parsed:
            print(f"❌ Failed to parse MCQs for {topic}.")
            
        return parsed
    except Exception as e:
        print(f"❌ Error generating questions for topic {topic}: {e}")
        return []

# --- Router Setup ---
router = APIRouter(prefix="/api/aptitude", tags=["Aptitude"])

class MCQRequest(BaseModel):
    topic: str
    count: int = 20
    difficulty: str | None = None

@router.post("/mcqs/test")
async def generate_aptitude_test(req: MCQRequest):
    aptitude_key = os.getenv("GEMINI_API_KEY_APTITUDE") or os.getenv("GEMINI_API_KEY")

    if req.topic == "Final Aptitude Test":
        try:
            tasks = [
                generate_single_topic("Quantitative Aptitude", 20, "hard", aptitude_key),
                generate_single_topic("Logical Reasoning", 15, "hard", aptitude_key),
                generate_single_topic("Verbal Ability", 15, "hard", aptitude_key),
            ]
            results = await asyncio.gather(*tasks)
            all_mcqs = [mcq for result in results for mcq in result]
            
            if not all_mcqs: raise Exception("AI returned 0 questions.")
            random.shuffle(all_mcqs)
            return all_mcqs
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Final test error: {str(e)}")

    try:
        mcqs = await generate_single_topic(req.topic, req.count, req.difficulty, aptitude_key)
        if not mcqs: raise HTTPException(status_code=500, detail="Failed to generate questions.")
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))