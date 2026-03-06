# backend/aptitude_routes.py
import os
import asyncio
import random
import re
import json
import ast
from fastapi import APIRouter, HTTPException
from google import genai
from pydantic import BaseModel

router = APIRouter(prefix="/api/aptitude", tags=["Aptitude"])

class MCQRequest(BaseModel):
    topic: str
    count: int = 20
    difficulty: str | None = None

# --- 1. LOCAL DATASET LOGIC (FOR FINAL EXAM) ---
def load_specific_db(filename):
    """Loads a specific JSON dataset file."""
    path = os.path.join(os.path.dirname(__file__), filename)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f: 
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Error reading {filename}: {e}")
            return []
    return []

def get_balanced_sample(module_qs, count=20):
    """Fetches exactly 20% Easy, 30% Medium, 50% Hard"""
    easy_qs = [q for q in module_qs if q.get('difficulty') == 'easy']
    med_qs = [q for q in module_qs if q.get('difficulty') == 'medium']
    hard_qs = [q for q in module_qs if q.get('difficulty') == 'hard']
    
    e_count = int(count * 0.20)
    m_count = int(count * 0.30)
    h_count = int(count * 0.50)
    
    test_qs = []
    # Use random.choices to allow duplicates if your DB is still small
    if easy_qs: test_qs.extend(random.choices(easy_qs, k=e_count))
    if med_qs: test_qs.extend(random.choices(med_qs, k=m_count))
    if hard_qs: test_qs.extend(random.choices(hard_qs, k=h_count))
    
    # Fill any missing gaps if the math was slightly off
    while len(test_qs) < count and module_qs:
        test_qs.append(random.choice(module_qs))
        
    return test_qs

# --- 2. LIVE AI LOGIC (FOR SINGLE TOPICS) ---
def generate_prompt(topic: str, count: int, difficulty: str | None = None) -> str:
    difficulty_line = f"Difficulty: {difficulty}." if difficulty else ""
    return f"""
    Generate exactly {count} multiple choice questions (MCQs) on the topic: {topic}.
    {difficulty_line}
    
    CRITICAL INSTRUCTIONS:
    1. Return STRICT JSON array.
    2. 'options' must be exactly 4 strings.
    3. 'answer' must be the EXACT text from the 'options' list.
    4. NO LATEX OR BACKSLASHES. Use standard text.
    5. Ensure explanations include a "Standard Method" and a "⚡ SHORTCUT Trick".
    
    Format:
    [
      {{
        "module": "General",
        "topic": "{topic}",
        "difficulty": "{difficulty}",
        "question": "...",
        "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
        "answer": "A. Option 1",
        "explanation": "Standard Method: ... \\n\\n⚡ SHORTCUT: ..."
      }}
    ]
    """

def clean_and_parse_json(text: str):
    text = re.sub(r'```json\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'```', '', text)
    text = text.replace('\\', '\\\\') 
    try: return json.loads(text)
    except:
        try: return ast.literal_eval(text)
        except: return []

def validate_mcqs(data, count):
    if not isinstance(data, list): return []
    cleaned = []
    for q in data:
        if not isinstance(q, dict): continue
        q = {k.lower(): v for k, v in q.items()}
        question = q.get("question")
        options = q.get("options")
        answer = q.get("answer")
        explanation = q.get("explanation", "No explanation provided.")

        if question and isinstance(options, list) and len(options) >= 2 and answer is not None:
            ans_str = str(answer).strip()
            opts_str = [str(opt).strip() for opt in options]
            matched_ans = None

            if ans_str in opts_str: matched_ans = ans_str
            else:
                clean_ans = ans_str.replace('.', '').strip().lower()
                letter_map = {'a': 0, 'b': 1, 'c': 2, 'd': 3, '0': 0, '1': 1, '2': 2, '3': 3}
                if clean_ans in letter_map and letter_map[clean_ans] < len(opts_str):
                    matched_ans = opts_str[letter_map[clean_ans]]
                else:
                    for opt in opts_str:
                        if ans_str.lower() in opt.lower() or opt.lower() in ans_str.lower():
                            matched_ans = opt
                            break
            if matched_ans:
                cleaned.append({
                    "question": str(question), "options": opts_str, 
                    "answer": matched_ans, "explanation": str(explanation)
                })
    return cleaned[:count]

async def generate_single_topic(topic: str, count: int, difficulty: str, api_key: str = None):
    if not api_key: return []
    client = genai.Client(api_key=api_key)
    prompt = generate_prompt(topic, count, difficulty)
    
    models_to_try = ["gemini-2.5-flash", "gemini-2.5-flash-lite"] 
    
    for model_name in models_to_try:
        try:
            response = await client.aio.models.generate_content(model=model_name, contents=prompt)
            data = clean_and_parse_json(response.text or "")
            valid_mcqs = validate_mcqs(data, count)
            if len(valid_mcqs) >= (count // 2): return valid_mcqs
        except Exception as e:
            print(f"⚠️ API Error: {e}")
            pass 
    return []

# --- 3. THE MAIN ROUTE ---
@router.post("/mcqs/test")
async def generate_aptitude_test(req: MCQRequest):
    
    # HYBRID LOGIC: If Final Test -> Load instantly from the 3 JSON Datasets
    if req.topic == "Final Aptitude Test":
        quant_qs = load_specific_db("quant_dataset.json")
        logic_qs = load_specific_db("logical_dataset.json")
        verb_qs = load_specific_db("verbal_dataset.json")
        
        if not quant_qs and not logic_qs and not verb_qs:
            raise HTTPException(status_code=500, detail="Databases missing. Run the background Python miners first.")
            
        final_exam = []
        
        # Get exactly 20 of each, perfectly balanced with 20% Easy / 30% Medium / 50% Hard
        if quant_qs: final_exam.extend(get_balanced_sample(quant_qs, 20))
        if logic_qs: final_exam.extend(get_balanced_sample(logic_qs, 20))
        if verb_qs: final_exam.extend(get_balanced_sample(verb_qs, 20))
        
        random.shuffle(final_exam)
        return final_exam

    # HYBRID LOGIC: If Single Topic -> Generate Live with AI
    api_key = os.getenv("GEMINI_API_KEY_APTITUDE") or os.getenv("GEMINI_API_KEY")
    mcqs = await generate_single_topic(req.topic, req.count, req.difficulty, api_key)
    
    if not mcqs:
        raise HTTPException(status_code=500, detail="Failed to generate AI questions. Rate limit may be exceeded.")
    
    return mcqs