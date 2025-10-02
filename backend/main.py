import os
import re
import json
import mysql.connector
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import google.generativeai as genai
from passlib.hash import argon2
import secrets
from datetime import datetime, timedelta
import smtplib
from email.message import EmailMessage
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load environment variables
load_dotenv()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Connect MySQL
db = mysql.connector.connect(
    host=os.getenv("DB_HOST", "localhost"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "placify")
)
cursor = db.cursor(dictionary=True)

# FastAPI app
app = FastAPI(title="Placify Backend", version="1.0.0")

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
    user_id: int | None = None

class RegisterUser(BaseModel):
    fname: str
    lname: str
    email: EmailStr
    year: int
    field: str
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str

class SubmitTest(BaseModel):
    user_id: int
    topic: str
    mode: str
    score: int
    total: int = 20  # Default total

class ModeStatusRequest(BaseModel):
    userId: int
    topic: str
    mode: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordWithIDRequest(BaseModel):
    user_id: int
    password: str

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str

def send_email(to_email: str, subject: str, body: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        smtp.send_message(msg)


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
    """

# ---- Utils ----
def validate_password(password: str):
    """
    Validate password strength:
    - Minimum 8 characters
    - At least 1 uppercase, 1 lowercase, 1 digit, 1 special character
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least one special character"
    return True, ""


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

    try:
        data = json.loads(arr_text)
    except json.JSONDecodeError:
        return []

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

# ---- Forgot Password ----
@app.post("/api/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    cursor.execute("SELECT id, fname FROM users WHERE email=%s", (req.email,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate 6-digit OTP
    otp = f"{secrets.randbelow(1000000):06}"
    expiry = datetime.now() + timedelta(minutes=10)

    # Save OTP to DB
    cursor.execute(
        "INSERT INTO password_resets (user_id, otp, expires_at) VALUES (%s,%s,%s)",
        (user["id"], otp, expiry)
    )
    db.commit()

    # Send OTP email
    subject = "Your OTP for Password Reset"
    body = f"Hello {user['fname']},\n\nYour OTP for password reset is: {otp}\nIt expires in 10 minutes."
    send_email(req.email, subject, body)

    return {"message": "OTP sent to your email"}


@app.post("/api/verify-otp")
def verify_otp(req: VerifyOTPRequest):
    cursor.execute(
        """
        SELECT pr.*, u.id as user_id FROM password_resets pr
        JOIN users u ON pr.user_id = u.id
        WHERE u.email=%s AND pr.otp=%s AND pr.expires_at > NOW()
        ORDER BY pr.id DESC LIMIT 1
        """,
        (req.email, req.otp)
    )
    record = cursor.fetchone()
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"message": "OTP verified", "user_id": record["user_id"]}



@app.post("/api/reset-password")
def reset_password_with_otp(req: ResetPasswordWithIDRequest):
    valid, msg = validate_password(req.password)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)

    hashed_pwd = argon2.hash(req.password)
    cursor.execute(
        "UPDATE users SET password=%s WHERE id=%s",
        (hashed_pwd, req.user_id)
    )
    # Delete OTP record after use
    cursor.execute("DELETE FROM password_resets WHERE user_id=%s", (req.user_id,))
    db.commit()

    return {"message": "Password reset successful"}

# ---- Auth Routes ----
@app.post("/api/register")
def register_user(user: RegisterUser):
    # Validate password strength
    valid, msg = validate_password(user.password)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)

    cursor.execute("SELECT * FROM users WHERE email=%s", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pwd = argon2.hash(user.password)
    cursor.execute(
        "INSERT INTO users (fname, lname, email, year, field, password) VALUES (%s, %s, %s, %s, %s, %s)",
        (user.fname, user.lname, user.email, user.year, user.field, hashed_pwd)
    )
    db.commit()
    return {"message": "User registered successfully"}


@app.post("/api/login")
def login_user(user: LoginUser):
    cursor.execute("SELECT * FROM users WHERE email=%s", (user.email,))
    record = cursor.fetchone()
    if not record or not argon2.verify(user.password, record["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": record}

@app.get("/api/user/{user_id}")
def get_user_details(user_id: int):
    # Fetch user info
    cursor.execute("SELECT id, fname, lname, email, year, field FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch user's test summary
    cursor.execute(
        "SELECT topic, mode, score, total, created_at FROM test_attempts WHERE user_id=%s ORDER BY created_at DESC",
        (user_id,)
    )
    tests = cursor.fetchall()

    return {"user": user, "tests": tests}

# ---- MCQ Generation ----
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
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/mcqs/test")
async def generate_test(req: MCQRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        count = req.count or 20
        prompt = generate_prompt(req.topic, count, req.difficulty)
        resp = model.generate_content(prompt)
        raw = resp.text or ""
        mcqs = parse_mcqs(raw, count)
        if not mcqs:
            raise HTTPException(status_code=500, detail="Failed to generate valid test questions")
        return mcqs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ---- Test submission ----
@app.post("/api/test/submit")
def submit_test(data: SubmitTest = Body(...)):
    # Validate user exists
    cursor.execute("SELECT id FROM users WHERE id=%s", (data.user_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute(
        "INSERT INTO test_attempts (user_id, topic, mode, score, total) VALUES (%s,%s,%s,%s,%s)",
        (data.user_id, data.topic, data.mode, data.score, data.total)
    )
    db.commit()

    next_mode = None
    passing_score = int(data.total * 0.75)

    if data.score >= passing_score:
        if data.mode == "easy":
            next_mode = "moderate"
        elif data.mode == "moderate":
            next_mode = "hard"

    return {"message": "Test recorded", "next_mode": next_mode, "passed": data.score >= passing_score}

# ---- Mode unlock check ----
@app.post("/api/test/mode-status")
def mode_status(req: ModeStatusRequest):
    # Easy mode is always unlocked
    if req.mode == "easy":
        return {"unlocked": True}
    
    prev_mode = "easy" if req.mode == "moderate" else "moderate"
    passing_score = 15  # 75% of 20

    cursor.execute(
        "SELECT * FROM test_attempts WHERE user_id=%s AND topic=%s AND mode=%s AND score>=%s ORDER BY id DESC LIMIT 1",
        (req.userId, req.topic, prev_mode, passing_score)
    )
    prev_mode_completed = bool(cursor.fetchone())

    return {"unlocked": prev_mode_completed}
