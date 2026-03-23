import os
import json
import time
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

# Load the environment variables
load_dotenv() 

API_KEY = os.getenv("GEMINI_API_KEY_APTITUDE") 
if not API_KEY:
    print("❌ ERROR: GEMINI_API_KEY not found. Please check your .env file.")
    exit(1)

client = genai.Client(api_key=API_KEY)
DATA_FILE = "final_aptitude_dataset.json"

# 🔥 We now enforce a schema for EXACTLY ONE question. It is mathematically impossible to break.
class SingleQuestionModel(BaseModel):
    q: str
    options: list[str]
    ans: str
    exp: str

def load_existing_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

def get_highest_id(dataset):
    max_id = 0
    for q in dataset:
        try:
            qid = int(q.get("id", 0))
            if qid > max_id:
                max_id = qid
        except (ValueError, TypeError):
            pass 
    return max_id

def generate_single_question(category: str, difficulty: str, question_id: int):
    """Generates EXACTLY ONE question. Fast, cheap, and 100% crash-proof."""
    
    category_instructions = ""
    if category == "Quantitative Aptitude":
        category_instructions = "Focus on Advanced Time/Speed/Distance, Complex Permutation/Combination, Probability, Advanced Geometry, and tricky Profit/Loss."
    elif category == "Logical Reasoning":
        category_instructions = "Focus on Complex Seating Arrangements, Multi-parameter Syllogisms, Difficult Blood Relations combined with puzzles, and tricky Data Sufficiency."
    elif category == "Verbal Ability":
        category_instructions = "Focus on high-level Reading Comprehension inference, difficult Para-jumbles, Corporate-level Vocabulary/Idioms, and complex Sentence Correction."

    prompt = f"""
    You are an expert exam setter for a rigorous FINAL campus placement assessment (targeting FAANG, TCS Digital).
    
    Generate EXACTLY ONE UNIQUE multiple-choice question for the '{category}' section.
    DIFFICULTY LEVEL: {difficulty}.
    
    CRITICAL RULES:
    1. {category_instructions}
    2. It must be difficult. If 'Medium', it requires pen-and-paper. If 'Hard', it is a top-tier placement question.
    3. Make it completely different from standard typical textbook questions.
    4. Provide the detailed, step-by-step solution in the 'exp' field.
    """
    
    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=SingleQuestionModel, # Enforce single question schema
                    temperature=0.8, # Slightly higher temperature for better variety
                )
            )
            
            # The API guarantees this is a perfect JSON dictionary for a single question
            raw_data = json.loads(response.text)
            
            # Validate options length
            if isinstance(raw_data.get("options"), list) and len(raw_data["options"]) >= 2:
                formatted_question = {
                    "id": question_id,
                    "q": raw_data["q"],
                    "options": raw_data["options"][:4], 
                    "ans": raw_data["ans"],
                    "diff": difficulty,
                    "category": category,
                    "exp": raw_data["exp"]
                }
                return formatted_question
            
        except Exception as e:
            time.sleep(2) # Quick sleep on failure before retry
            
    return None # Return None if all 3 attempts to make 1 question fail

def build_dataset_safely(loops=5, questions_per_topic=10):
    print("🚀 Initializing Indestructible 'One-By-One' Final Aptitude Builder...\n")
    
    batches = [
        ("Verbal Ability", "Hard"),
        ("Quantitative Aptitude", "Medium"),
        ("Logical Reasoning", "Medium"),
        ("Verbal Ability", "Medium"),
        ("Quantitative Aptitude", "Hard"),
        ("Logical Reasoning", "Hard"),
       
    ]

    for loop in range(loops):
        print(f"======================================")
        print(f"🔄 STARTING MAIN BUILDER LOOP {loop+1}/{loops}")
        print(f"======================================")
        
        for category, diff in batches:
            print(f"\n📚 Target: {questions_per_topic} {diff} {category} questions...")
            
            dataset = load_existing_data()
            current_id = get_highest_id(dataset) + 1
            
            success_count = 0
            
            # 🔥 THE ONE-BY-ONE LOOP 🔥
            for i in range(questions_per_topic):
                print(f"   Generating question {i+1}/{questions_per_topic} (ID: {current_id})... ", end="", flush=True)
                
                new_q = generate_single_question(category, diff, current_id)
                
                if new_q:
                    # Save it immediately! Never lose progress.
                    dataset.append(new_q)
                    save_data(dataset)
                    print("✅ Saved!")
                    current_id += 1
                    success_count += 1
                else:
                    print("❌ Failed.")
                
                time.sleep(1.5) # Tiny buffer to prevent rate limiting
            
            print(f"🎯 Finished batch. Successfully added {success_count}/{questions_per_topic} questions.\n")
            time.sleep(5)

if __name__ == "__main__":
    # Generates 10 questions per topic, loops 5 times = 300 total questions.
    # Because it generates 1 at a time, it will slowly and steadily build your database forever without crashing.
    build_dataset_safely(loops=5, questions_per_topic=10)