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

async def generate_single_topic(topic: str, count: int, difficulty: str):
    try:
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
    if req.topic == "Final Aptitude Test":
        try:
            tasks = [
                generate_single_topic("Quantitative Aptitude", 20, "hard"),
                generate_single_topic("Logical Reasoning", 15, "hard"),
                generate_single_topic("Verbal Ability", 15, "hard"),
            ]
            results = await asyncio.gather(*tasks)
            all_mcqs = [mcq for result in results for mcq in result]
            if not all_mcqs: raise Exception("No questions generated.")
            random.shuffle(all_mcqs)
            return all_mcqs
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Final test generation error: {e}")

    try:
        mcqs = await generate_single_topic(req.topic, req.count, req.difficulty)
        if not mcqs: raise HTTPException(status_code=500, detail="Failed to generate valid test questions")
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# ... (add this with your other Pydantic models)
class NoteRequest(BaseModel):
    topic: str

# --- New Helper Function for AI Notes ---
# --- New Helper Function for AI Notes ---
async def generate_notes_for_topic(topic: str):
    """
    Generates detailed, high-quality notes for a specific topic using AI.
    """
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        # --- NEW, STRICTER PROMPT ---
        prompt = f"""
        You are an expert aptitude trainer. Your goal is to teach a student this topic from scratch.
        Generate a detailed, high-quality, and easy-to-understand note for the aptitude topic: "{topic}".

        The note MUST include:
        1.  **Conceptual Overview:** A clear explanation of what the topic is.
        2.  **Key Formulas:** A list of the most important formulas, clearly explained.
        3.  **Solved Examples:** At least two step-by-step solved examples.
        4.  **Tips & Tricks:** Common shortcuts or mistakes to avoid.

        YOU MUST FORMAT the entire response in clean Markdown using these rules ONLY:
        - Use `###` for main section headings (like '### 1. Conceptual Overview').
        - Use `####` for sub-headings (like '#### A. Classification of Numbers').
        - Use `**bold text**` for ALL bolding. Do NOT use single asterisks for bolding.
        - Use `* ` (an asterisk followed by a space) for ALL bullet points.
        - Use `1. ` (number, period, space) for ALL numbered lists.
        - Use `---` for horizontal dividers.
        """
        
        # --- Use a GenerationConfig for clean text output ---
        config = genai.GenerationConfig(temperature=0.2) # Low temp for less "creativity"
        resp = await model.generate_content_async(prompt, generation_config=config)
        
        # Clean up the markdown response
        raw_text = resp.text or ""
        cleaned_text = raw_text.replace("```markdown", "").replace("```", "").strip()
        
        return cleaned_text
        
    except Exception as e:
        print(f"Error generating notes for topic {topic}: {e}")
        return "Error: Could not generate notes for this topic. Please try again."
# --- New Endpoint (add this inside the file) ---
@router.post("/notes")
async def get_aptitude_notes(req: NoteRequest):
    try:
        notes = await generate_notes_for_topic(req.topic)
        return {"notes": notes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))