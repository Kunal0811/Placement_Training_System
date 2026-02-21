# backend/aptitude_routes.py
import os
import asyncio
import random
import re
import json
import ast
from fastapi import APIRouter, Body, HTTPException
from google import genai
from pydantic import BaseModel

router = APIRouter(prefix="/api/aptitude", tags=["Aptitude"])

class MCQRequest(BaseModel):
    topic: str
    count: int = 20
    difficulty: str | None = None

# --- Helper Functions ---
def generate_prompt(topic: str, count: int, difficulty: str | None = None) -> str:
    difficulty_line = f"Difficulty: {difficulty}." if difficulty else ""
    return f"""
    Generate exactly {count} multiple choice questions (MCQs) on the topic: {topic}.
    {difficulty_line}
    
    CRITICAL INSTRUCTIONS:
    1. Return STRICT JSON array.
    2. 'options' must be a list of 4 strings.
    3. 'answer' must be the EXACT string text from the 'options' list, NOT just the letter 'A' or index.
    
    Format:
    [
      {{
        "question": "...",
        "options": ["Option 1 Text", "Option 2 Text", "Option 3 Text", "Option 4 Text"],
        "answer": "Option 1 Text",
        "explanation": "..."
      }}
    ]
    """

def clean_and_parse_json(text: str):
    text = re.sub(r'```json\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'```', '', text)
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            return ast.literal_eval(text)
        except:
            return []

def validate_mcqs(data, count):
    if not isinstance(data, list): return []
    cleaned = []
    
    for q in data:
        # Key normalization
        q = {k.lower(): v for k, v in q.items()}
        
        question = q.get("question")
        options = q.get("options")
        answer = q.get("answer")
        explanation = q.get("explanation", "")

        if (isinstance(question, str) and isinstance(options, list) and 
            len(options) >= 2 and isinstance(answer, str)):
            
            # --- FIX: SMART ANSWER MAPPING ---
            # If answer is not in options, check if it's a letter (A, B, C, D) or index (0, 1, 2, 3)
            if answer not in options:
                # Check for "A", "B", "C", "D" mapping
                letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3}
                clean_answer = answer.strip().split('.')[0].strip() # Handle "A." or "A"
                
                if clean_answer in letter_map and letter_map[clean_answer] < len(options):
                    # Remap answer "A" to the actual option text "A. $80"
                    answer = options[letter_map[clean_answer]]
                
                # Check for numeric index (0, 1, 2)
                elif answer.isdigit():
                    idx = int(answer)
                    if 0 <= idx < len(options):
                        answer = options[idx]

            # Final check: only add if we successfully resolved the answer
            if answer in options:
                cleaned.append({
                    "question": question,
                    "options": options,
                    "answer": answer,
                    "explanation": explanation
                })
                
    return cleaned[:count]

async def generate_single_topic(topic: str, count: int, difficulty: str, api_key: str = None):
    try:
        if not api_key: return []
        
        client = genai.Client(api_key=api_key)
        prompt = generate_prompt(topic, count, difficulty)
        
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        raw_text = response.text or ""
        data = clean_and_parse_json(raw_text)
        return validate_mcqs(data, count)

    except Exception as e:
        print(f"❌ Error generating {topic}: {e}")
        return []

# --- Routes ---
@router.post("/mcqs/test")
async def generate_aptitude_test(req: MCQRequest):
    api_key = os.getenv("GEMINI_API_KEY_APTITUDE") or os.getenv("GEMINI_API_KEY")

    if req.topic == "Final Aptitude Test":
        try:
            # We break 50 questions into chunks of 10 and 5 to prevent the AI from stopping early!
            tasks = [
                generate_single_topic("Quantitative Aptitude", 10, "hard", api_key),
                generate_single_topic("Quantitative Aptitude", 10, "hard", api_key),
                generate_single_topic("Logical Reasoning", 10, "hard", api_key),
                generate_single_topic("Logical Reasoning", 5, "hard", api_key),
                generate_single_topic("Verbal Ability", 10, "hard", api_key),
                generate_single_topic("Verbal Ability", 5, "hard", api_key),
            ]
            results = await asyncio.gather(*tasks)
            all_mcqs = [mcq for result in results for mcq in result]
            
            if not all_mcqs: 
                raise HTTPException(status_code=500, detail="AI returned 0 questions.")
            
            random.shuffle(all_mcqs)
            
            # Failsafe: Ensure we only return exactly 50 if it over-generated
            return all_mcqs[:50] 
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    # Standard Topic Test (Non-Final)
    mcqs = await generate_single_topic(req.topic, req.count, req.difficulty, api_key)
    if not mcqs:
        raise HTTPException(status_code=500, detail="Failed to parse valid questions from AI response.")
    
    return mcqs