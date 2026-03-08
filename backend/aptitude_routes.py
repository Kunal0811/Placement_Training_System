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

# --- 1. LOCAL DATASET LOGIC ---
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
    """Fetches exactly 20% Easy, 30% Medium, 50% Hard for Final Exam"""
    easy_qs = [q for q in module_qs if q.get('difficulty') == 'easy']
    med_qs = [q for q in module_qs if q.get('difficulty') == 'medium']
    hard_qs = [q for q in module_qs if q.get('difficulty') == 'hard']
    
    e_count = int(count * 0.20)
    m_count = int(count * 0.30)
    h_count = int(count * 0.50)
    
    test_qs = []
    if easy_qs: test_qs.extend(random.choices(easy_qs, k=e_count))
    if med_qs: test_qs.extend(random.choices(med_qs, k=m_count))
    if hard_qs: test_qs.extend(random.choices(hard_qs, k=h_count))
    
    while len(test_qs) < count and module_qs:
        test_qs.append(random.choice(module_qs))
        
    return test_qs

def normalize_string_for_match(s: str) -> str:
    """Cleans strings to make topic matching bulletproof (e.g. 'Time, Speed, & Distance' -> 'time speed distance')"""
    if not s: return ""
    s = s.lower()
    s = re.sub(r'[^a-z0-9]', ' ', s) # replace non-alphanumeric with space
    s = s.replace(" and ", " ")
    s = re.sub(r'\s+', ' ', s).strip()
    return s

def get_local_topic_questions(topic: str, count: int, difficulty: str | None = None):
    """Searches ALL local JSON databases for questions matching the exact topic and difficulty."""
    quant_qs = load_specific_db("quant_dataset.json")
    logic_qs = load_specific_db("logical_dataset.json")
    verb_qs = load_specific_db("verbal_dataset.json")
    
    all_qs = quant_qs + logic_qs + verb_qs
    if not all_qs: return []
        
    search_topic = normalize_string_for_match(topic)
    filtered_qs = []
    
    for q in all_qs:
        q_topic = normalize_string_for_match(q.get("topic", ""))
        
        # Match the topic substring (so AI variations like "Time Speed Distance" match the frontend request)
        if search_topic in q_topic or q_topic in search_topic:
            
            # Match difficulty if specified (ignore if user selected 'mixed')
            if difficulty and difficulty.lower() not in ["mixed", "all", "none"]:
                if q.get("difficulty", "").lower() == difficulty.lower():
                    filtered_qs.append(q)
            else:
                filtered_qs.append(q)
                
    # Return exact amount requested if we have enough
    if len(filtered_qs) >= count:
        return random.sample(filtered_qs, count)
        
    return filtered_qs # Return whatever we have (even if it's less than requested)

# --- 2. LIVE AI LOGIC ---
def generate_prompt(topic: str, count: int, difficulty: str | None = None) -> str:
    difficulty_line = f"Difficulty: {difficulty}." if difficulty and difficulty.lower() != "mixed" else "Ensure a mix of difficulty levels."
    return f"""
    Generate exactly {count} multiple choice questions (MCQs) on the topic: {topic}.
    {difficulty_line}
    
    CRITICAL INSTRUCTIONS:
    1. Return STRICT JSON array.
    2. 'options' must be exactly 4 strings.
    3. 'answer' must be the EXACT text from the 'options' list.
    4. NO LATEX OR BACKSLASHES. Use standard text.
    5. 'explanation' MUST be formatted with exact headers "*Standard method*:" and "*SHORTCUT Trick*:".
    6. In the 'explanation', you MUST insert a newline character (\\n) after EACH full stop (.) so every sentence/step is on a new line.
    
    Format:
    [
      {{
        "module": "General",
        "topic": "{topic}",
        "difficulty": "{difficulty or 'medium'}",
        "question": "...",
        "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
        "answer": "A. Option 1",
        "explanation": "*Standard method*:\\nThe formula for circumference is C = 2 * pi * r.\\nGiven r = 7 cm, C = 2 * (22/7) * 7.\\nThe 7 cancels out.\\nC = 44 cm.\\n\\n*SHORTCUT Trick*:\\nMemorize base values for r=7.\\nCircumference is 44 cm.\\nArea is 154 sq cm.\\n"
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
                    "answer": matched_ans, "explanation": str(explanation),
                    "topic": q.get("topic", "General"),
                    "difficulty": q.get("difficulty", "medium")
                })
    return cleaned[:count]

async def generate_single_topic(topic: str, count: int, difficulty: str, api_key: str = None):
    if not api_key or count <= 0: return []
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
    
    # 1. FINAL TEST LOGIC (Gets 20 random from ALL datasets)
    if req.topic == "Final Aptitude Test":
        quant_qs = load_specific_db("quant_dataset.json")
        logic_qs = load_specific_db("logical_dataset.json")
        verb_qs = load_specific_db("verbal_dataset.json")
        
        if not quant_qs and not logic_qs and not verb_qs:
            raise HTTPException(status_code=500, detail="Databases missing. Run the background Python miners first.")
            
        final_exam = []
        if quant_qs: final_exam.extend(get_balanced_sample(quant_qs, 20))
        if logic_qs: final_exam.extend(get_balanced_sample(logic_qs, 20))
        if verb_qs: final_exam.extend(get_balanced_sample(verb_qs, 20))
        
        random.shuffle(final_exam)
        return final_exam

    # 2. MODULE/TOPIC TEST LOGIC -> Try Local DB FIRST!
    local_qs = get_local_topic_questions(req.topic, req.count, req.difficulty)
    
    # If we found exactly 20 (or however many requested) locally, return them instantly!
    if len(local_qs) == req.count:
        random.shuffle(local_qs)
        return local_qs

    # 3. FALLBACK HYBRID LOGIC -> Not enough Qs locally? Use AI to generate the missing amount.
    needed_count = req.count - len(local_qs)
    print(f"⚠️ Found {len(local_qs)}/{req.count} local Qs for '{req.topic}' ({req.difficulty}). Asking AI for {needed_count} more...")
    
    api_key = os.getenv("GEMINI_API_KEY_APTITUDE") or os.getenv("GEMINI_API_KEY")
    ai_qs = await generate_single_topic(req.topic, needed_count, req.difficulty, api_key)
    
    final_qs = local_qs + ai_qs
    
    if not final_qs:
        raise HTTPException(status_code=500, detail="Failed to generate AI questions. Rate limit may be exceeded.")
    
    random.shuffle(final_qs)
    return final_qs