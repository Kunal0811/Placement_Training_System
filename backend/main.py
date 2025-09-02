# main.py
import os, re, json, bcrypt
from fastapi import FastAPI, Body, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import google.generativeai as genai
from database import get_db, engine, Base
from models import Result
from auth_routes import router as auth_router

# ------------------ Load Environment ------------------
load_dotenv()

# ------------------ Create Database Tables ------------------
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print("❌ Error creating tables:", str(e))

# ------------------ Configure Gemini ------------------
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("❌ GEMINI_API_KEY not found in environment variables.")
genai.configure(api_key=api_key)

# ------------------ FastAPI App ------------------
app = FastAPI(title="Placify Backend", version="1.1.0")

# ------------------ CORS ------------------
allowed = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://192.168.0.106:5173"
).split(",")
allowed = [o.strip() for o in allowed if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------ Routers ------------------
app.include_router(auth_router)

# ------------------ Utils ------------------
def generate_prompt(topic: str, count: int, difficulty: str | None = None) -> str:
    difficulty_line = f"Difficulty: {difficulty}." if difficulty else ""
    return f"""
    Generate exactly {count} multiple choice questions (MCQs) on the topic: {topic}.
    {difficulty_line}
    Return STRICT JSON ONLY (no markdown, no text outside JSON) as a list of objects with fields:
    - "question" (string)
    - "options" (array of exactly 4 distinct strings)
    - "answer" (one of the options, string)
    - "explanation" (string, 2–3 lines explaining why the answer is correct)
    """


def parse_mcqs(raw: str, count: int):
    try:
        m = re.search(r"\[\s*\{.*?\}\s*\]", raw, re.S)
        if not m:
            return []
        arr_text = m.group(0)
        data = json.loads(arr_text)
        return data[:count]
    except Exception:
        return []

# ------------------ Routes ------------------
@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/mcqs/generate")
async def generate_mcqs(req: dict = Body(...)):
    """Generate practice MCQs"""
    try:
        topic = req.get("topic")
        count = req.get("count", 5)
        difficulty = req.get("difficulty")

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = generate_prompt(topic, count, difficulty)
        resp = model.generate_content(prompt)
        raw = resp.text or ""
        mcqs = parse_mcqs(raw, count)
        if not mcqs:
            raise HTTPException(status_code=500, detail="Failed to parse MCQs")
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail="MCQ generation failed: " + str(e))


@app.post("/api/mcqs/test")
async def generate_test(req: dict = Body(...)):
    """Generate a test with 20 MCQs"""
    try:
        topic = req.get("topic")
        difficulty = req.get("difficulty")

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = generate_prompt(topic, 20, difficulty)
        resp = model.generate_content(prompt)
        raw = resp.text or ""
        mcqs = parse_mcqs(raw, 20)
        if not mcqs:
            raise HTTPException(status_code=500, detail="Failed to parse test MCQs")
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail="Test generation failed: " + str(e))


@app.post("/api/results/save")
def save_result(req: dict = Body(...), db: Session = Depends(get_db)):
    """Save user test results"""
    result = Result(
        user_id=req["user_id"],
        topic=req["topic"],
        score=req["score"],
        total=req["total"],
    )
    db.add(result)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Error saving result: " + str(e))
    return {"message": "Result saved"}


@app.get("/api/results/{user_id}")
def get_results(user_id: int, db: Session = Depends(get_db)):
    results = db.query(Result).filter(Result.user_id == user_id).order_by(Result.created_at.desc()).all()
    return [
        {"topic": r.topic, "score": r.score, "total": r.total, "date": r.created_at}
        for r in results
    ]


@app.get("/api/progress/{user_id}")
def get_progress(user_id: int, db: Session = Depends(get_db)):
    results = db.query(Result).filter(Result.user_id == user_id).order_by(Result.created_at.asc()).all()
    return [{"date": r.created_at, "score": r.score, "total": r.total} for r in results]
