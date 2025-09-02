import os
import re
import json
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load env
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# FastAPI app
app = FastAPI(title="Placify Aptitude Backend", version="0.2.0")

# ---- CORS ----
allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
allowed = [o.strip() for o in allowed if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Models ----
class MCQRequest(BaseModel):
    topic: str
    count: int = 5
    difficulty: str | None = None

# ---- Utils ----
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

    Example:
    [
      {{
        "question":"What is 2+2?",
        "options":["2","3","4","5"],
        "answer":"4",
        "explanation":"2+2 equals 4 because addition combines two numbers."
      }}
    ]
    """

def parse_mcqs(raw: str, count: int):
    m = re.search(r"\[\s*\{.*?\}\s*\]", raw, re.S)
    if not m:
        m2 = re.search(r"\{.*\}", raw, re.S)
        if m2:
            arr_text = "[" + m2.group(0) + "]"
        else:
            return []
    else:
        arr_text = m.group(0)

    data = json.loads(arr_text)
    cleaned = []
    for q in data:
        if (
            isinstance(q.get("question"), str)
            and isinstance(q.get("options"), list)
            and len(q["options"]) == 4
            and isinstance(q.get("answer"), str)
            and q["answer"] in q["options"]
        ):
            cleaned.append({
                "question": q["question"],
                "options": q["options"],
                "answer": q["answer"],
                "explanation": q.get("explanation", "No explanation provided.")
            })

    return cleaned[:count]

# ---- Routes ----
@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/mcqs/generate")
async def generate_mcqs(req: MCQRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = generate_prompt(req.topic, req.count, req.difficulty)
        resp = model.generate_content(prompt)
        raw = resp.text or ""
        mcqs = parse_mcqs(raw, req.count)
        if not mcqs:
            return {"error": "No valid MCQs parsed", "raw": raw}
        return mcqs
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/mcqs/test")
async def generate_test(req: MCQRequest = Body(...)):
    """ Always generate a test of 20 MCQs for the given topic/subtitle. """
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = generate_prompt(req.topic, 20, req.difficulty)
        resp = model.generate_content(prompt)
        raw = resp.text or ""
        mcqs = parse_mcqs(raw, 20)
        if not mcqs:
            return {"error": "No valid test MCQs parsed", "raw": raw}
        return mcqs
    except Exception as e:
        return {"error": str(e)}