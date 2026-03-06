# backend/build_logical.py
import os, json, asyncio, re, ast
from google import genai
from dotenv import load_dotenv

load_dotenv()
DATASET_PATH = "logical_dataset.json"
MODULE_NAME = "Logical Reasoning"

def generate_prompt(difficulty: str) -> str:
    return f"""
    Generate exactly 10 unique, highly challenging multiple choice questions for the {MODULE_NAME} module.
    Difficulty: {difficulty}. Ensure these are placement-exam standard questions.
    
    CRITICAL INSTRUCTIONS TO PREVENT JSON CRASHES:
    1. Return ONLY a valid JSON array.
    2. 'options' must be exactly 4 strings.
    3. 'answer' must EXACTLY MATCH one of the options.
    4. NEVER USE DOUBLE QUOTES (") ANYWHERE INSIDE YOUR TEXT. If you need to quote variables (like A, B, C), you MUST use single quotes (like 'A', 'B', 'C').
    5. DO NOT use physical line breaks (Enter key) inside your strings. If you need a newline, write exactly \\n as literal characters.
    6. KEEP EXPLANATIONS SHORT AND CONCISE (Under 50 words). If you write too much, the JSON will get cut off at the end and crash the system!
    7. 'explanation' MUST contain: "Standard Method" and a "⚡ SHORTCUT" trick.
    
    Format:
    [
      {{
        "module": "{MODULE_NAME}",
        "topic": "Specific Sub-topic (e.g. Blood Relations, Coding Decoding)",
        "difficulty": "{difficulty}",
        "question": "If 'A' is the brother of 'B'...",
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
    print(f"📙 LOGICAL DB Updated! Added: {unique_added} | Total: {len(existing)}")

async def main():
    api_key = os.getenv("GEMINI_API_KEY_LOGICAL") or os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    runs = ["easy", "easy", "medium", "medium", "medium", "hard", "hard", "hard", "hard", "hard"]
    
    print(f"🚀 Starting {MODULE_NAME} Miner...")
    while True:
        for diff in runs:
            print(f"Mining 10 {diff} {MODULE_NAME} Qs...")
            try:
                res = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=generate_prompt(diff))
                
                # Check if Google's API cut off the output because it was too long
                if res.candidates and res.candidates[0].finish_reason == 2:
                    print("⚠️ WARNING: AI hit maximum output length and cut off the JSON. Attempting rescue...")

                match = re.search(r'\[\s*\{.*?\}\s*\]', res.text or "", re.DOTALL)
                if match:
                    clean_json = match.group(0)
                    data = []
                    try: 
                        data = json.loads(clean_json, strict=False)
                    except:
                        try:
                            flat_json = clean_json.replace('\n', ' ').replace('\r', '')
                            data = json.loads(flat_json)
                        except:
                            try:
                                data = ast.literal_eval(clean_json.replace("true", "True").replace("false", "False"))
                            except Exception as final_err:
                                print(f"⚠️ AI generated corrupted JSON. Safely skipping. Error: {final_err}")
                                data = []
                    
                    valid_qs = [q for q in data if isinstance(q, dict) and len(q.get("options", [])) == 4]
                    if valid_qs: save_to_dataset(valid_qs)
            except Exception as e: print(f"⚠️ Error: {e}")
            await asyncio.sleep(15)

if __name__ == "__main__": asyncio.run(main())