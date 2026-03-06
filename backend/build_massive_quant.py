# backend/build_quant.py
import os, json, asyncio, re, ast
from google import genai
from dotenv import load_dotenv

load_dotenv()
DATASET_PATH = "quant_dataset.json"
MODULE_NAME = "Quantitative Aptitude"

def generate_prompt(difficulty: str) -> str:
    return f"""
    Generate exactly 10 unique, highly challenging multiple choice questions for the {MODULE_NAME} module.
    Difficulty: {difficulty}. Ensure these are placement-exam standard questions.
    
    CRITICAL INSTRUCTIONS:
    1. Return ONLY a valid JSON array.
    2. 'options' must be exactly 4 strings.
    3. 'answer' must EXACTLY MATCH one of the options.
    4. NO LATEX OR BACKSLASHES. Write math as standard text (e.g. pi, x^2).
    5. ONLY USE SINGLE QUOTES (') inside your text. NEVER use double quotes (").
    6. 'explanation' MUST contain: "Standard Method" and a "⚡ SHORTCUT" trick.
    
    Format:
    [
      {{
        "module": "{MODULE_NAME}",
        "topic": "Specific Sub-topic (e.g. Time & Work)",
        "difficulty": "{difficulty}",
        "question": "...",
        "options": ["A. Opt1", "B. Opt2", "C. Opt3", "D. Opt4"],
        "answer": "A. Opt1",
        "explanation": "Standard Method: ... \\n\\n⚡ SHORTCUT: ..."
      }}
    ]
    """

def save_to_dataset(new_qs):
    existing = []
    if os.path.exists(DATASET_PATH):
        with open(DATASET_PATH, "r", encoding="utf-8") as f:
            try: existing = json.load(f)
            except: pass
    
    max_id = max([q.get("id", 0) for q in existing] + [0])
    existing_texts = {re.sub(r'[^a-z0-9]', '', q.get("question", "").lower()) for q in existing}
    unique_added = 0
    
    for q in new_qs:
        q_norm = re.sub(r'[^a-z0-9]', '', q.get("question", "").lower())
        if q_norm and q_norm not in existing_texts:
            max_id += 1 
            q["id"] = max_id
            q["module"] = MODULE_NAME
            existing.append(q)
            existing_texts.add(q_norm) 
            unique_added += 1
            
    with open(DATASET_PATH, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2)
    print(f"📘 QUANT DB Updated! Added: {unique_added} | Total: {len(existing)}")

async def main():
    api_key = os.getenv("GEMINI_API_KEY_QUANT") or os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    runs = ["easy", "easy", "medium", "medium", "medium", "hard", "hard", "hard", "hard", "hard"]
    
    print(f"🚀 Starting {MODULE_NAME} Miner...")
    while True:
        for diff in runs:
            print(f"Mining 10 {diff} {MODULE_NAME} Qs...")
            try:
                res = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=generate_prompt(diff))
                match = re.search(r'\[\s*\{.*?\}\s*\]', res.text or "", re.DOTALL)
                if match:
                    clean_json = match.group(0)
                    data = []
                    try: 
                        # 1. Try standard lenient parsing
                        data = json.loads(clean_json, strict=False)
                    except:
                        try:
                            # 2. FLATTEN FIX: If the AI pressed "Enter" inside a string, flatten it into one safe line!
                            flat_json = clean_json.replace('\n', ' ').replace('\r', '')
                            data = json.loads(flat_json)
                        except:
                            try:
                                # 3. Fallback to Python AST evaluator
                                data = ast.literal_eval(clean_json.replace("true", "True").replace("false", "False"))
                            except:
                                # 4. If it's completely unreadable, silently skip it without a scary red error!
                                print("⚠️ AI generated unreadable format. Safely skipping this batch...")
                                data = []
                    
                    valid_qs = [q for q in data if isinstance(q, dict) and len(q.get("options", [])) == 4]
                    if valid_qs: save_to_dataset(valid_qs)
            except Exception as e: print(f"⚠️ Error: {e}")
            await asyncio.sleep(30)

if __name__ == "__main__": asyncio.run(main())