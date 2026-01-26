import os
import re
import json
import mysql.connector
from fastapi import FastAPI, Body, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # <-- Import StaticFiles
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import secrets
from datetime import datetime, timedelta
import smtplib
from email.message import EmailMessage
from passlib.hash import argon2
import google.generativeai as genai
import shutil  # <-- Import shutil
import uuid    # <-- Import uuid
import nltk
import interview_models
from sqlalchemy import text
from datetime import datetime, timedelta

# Import from the new database file and other route files
from database import get_cursor, engine, Base
from aptitude_routes import router as aptitude_router
from technical_routes import router as technical_router
from coding_routes import router as coding_router
from resume_routes import router as resume_router
from interview_routes import router as interview_router

# --- Setup ---
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

Base.metadata.create_all(bind=engine)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    print("Downloading NLTK 'punkt' package...")
    nltk.download('punkt_tab')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading NLTK 'stopwords' package...")
    nltk.download('stopwords')

app = FastAPI(title="Placify Backend", version="1.0.0")

# --- Mount Static Files Directory ---
# This makes files in the 'static' folder accessible via the /static URL
os.makedirs("static/profile_pics", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


# --- CORS Middleware ---
allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173",).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(aptitude_router)
app.include_router(technical_router)
app.include_router(coding_router)
app.include_router(resume_router, prefix="/api")
app.include_router(interview_router)

# ---- Pydantic Models ----
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
    total: int = 20
    time_taken: int | None = None

class ModeStatusRequest(BaseModel):
    userId: int
    topic: str
    mode: str

class BestScoreRequest(BaseModel):
    userId: int
    topic: str
    mode: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str
    
class ResetPasswordWithIDRequest(BaseModel):
    user_id: int
    password: str

class LevelStatusRequest(BaseModel):
    user_id: int
    difficulty: str

# ---- Utility Functions ----
def send_email(to_email: str, subject: str, body: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to_email
    msg.set_content(body)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
        smtp.send_message(msg)

def validate_password(password: str):
    if len(password) < 8: return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password): return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password): return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password): return False, "Password must contain at least one digit"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password): return False, "Password must contain at least one special character"
    return True, ""


# ---- API Routes ----

@app.get("/health")
def health():
    return {"status": "ok"}

# ---- Password Reset Routes ----
@app.post("/api/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT id, fname FROM users WHERE email=%s", (req.email,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = f"{secrets.randbelow(1000000):06}"
    expiry = datetime.now() + timedelta(minutes=10)
    cursor.execute("INSERT INTO password_resets (user_id, otp, expires_at) VALUES (%s,%s,%s)", (user["id"], otp, expiry))
    db.commit()

    send_email(req.email, "Your OTP for Password Reset", f"Hello {user['fname']},\n\nYour OTP is: {otp}\nIt expires in 10 minutes.")
    return {"message": "OTP sent to your email"}


@app.post("/api/verify-otp")
def verify_otp(req: VerifyOTPRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
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
def reset_password_with_otp(req: ResetPasswordWithIDRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    valid, msg = validate_password(req.password)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)

    hashed_pwd = argon2.hash(req.password)
    cursor.execute("UPDATE users SET password=%s WHERE id=%s", (hashed_pwd, req.user_id))
    cursor.execute("DELETE FROM password_resets WHERE user_id=%s", (req.user_id,))
    db.commit()
    return {"message": "Password reset successful"}

# ---- Auth Routes ----
@app.post("/api/register")
def register_user(user: RegisterUser, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    valid, msg = validate_password(user.password)
    if not valid:
        raise HTTPException(status_code=400, detail=msg)

    cursor.execute("SELECT id FROM users WHERE email=%s", (user.email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pwd = argon2.hash(user.password)
    cursor.execute(
        "INSERT INTO users (fname, lname, email, year, field, password) VALUES (%s, %s, %s, %s, %s, %s)",
        (user.fname, user.lname, user.email, user.year, user.field, hashed_pwd)
    )
    db.commit()
    return {"message": "User registered successfully"}

@app.post("/api/user/{user_id}/upload-pfp")
async def upload_profile_picture(user_id: int, file: UploadFile = File(...), db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    # Generate a unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join("static/profile_pics", unique_filename)

    # Save the file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")

    # Construct the URL
    profile_picture_url = f"/static/profile_pics/{unique_filename}"

    # Update the database
    cursor.execute("UPDATE users SET profile_picture_url = %s WHERE id = %s", (profile_picture_url, user_id))
    db.commit()

    return {"message": "Profile picture updated successfully", "profile_picture_url": profile_picture_url}


@app.post("/api/login")
def login_user(user: LoginUser, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT * FROM users WHERE email=%s", (user.email,))
    record = cursor.fetchone()
    if not record or not argon2.verify(user.password, record["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": record}

@app.get("/api/user/{user_id}")
def get_user_details(user_id: int, db_cursor: tuple = Depends(get_cursor), page: int = 1, limit: int = 20):
    cursor, db = db_cursor
    cursor.execute("SELECT id, fname, lname, email, year, field, profile_picture_url FROM users WHERE id=%s", (user_id,))
    user = cursor.fetchone()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    offset = (page - 1) * limit
    cursor.execute(
        "SELECT id, topic, mode, score, total, created_at FROM test_attempts WHERE user_id=%s ORDER BY created_at DESC LIMIT %s OFFSET %s",
        (user_id, limit, offset)
    )
    tests = cursor.fetchall()

    cursor.execute(
        "SELECT problem_title, difficulty, is_correct, created_at FROM coding_attempts WHERE user_id=%s ORDER BY created_at DESC",
        (user_id,)
    )
    coding_attempts = cursor.fetchall()

    cursor.execute(
        "SELECT id, interview_type, job_role, overall_score, created_at FROM interview_attempts WHERE user_id=%s ORDER BY created_at DESC",
        (user_id,)
    )
    interviews = cursor.fetchall()

    return {
        "user": user, 
        "tests": tests, 
        "coding": coding_attempts,
        "interviews": interviews
    }

# ---- Test Submission & Mode Unlock Routes ----
@app.post("/api/test/submit")
def submit_test(data: SubmitTest = Body(...), db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT id FROM users WHERE id=%s", (data.user_id,))
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="User not found")

    cursor.execute(
        "INSERT INTO test_attempts (user_id, topic, mode, score, total, time_taken) VALUES (%s,%s,%s,%s,%s,%s)",
        (data.user_id, data.topic, data.mode, data.score, data.total, data.time_taken)
    )
    db.commit()
    
    passing_score = int(data.total * 0.75)
    return {"message": "Test recorded", "passed": data.score >= passing_score}

@app.post("/api/test/mode-status")
def mode_status(req: ModeStatusRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    if req.mode == "easy":
        return {"unlocked": True}
    
    prev_mode = "easy" if req.mode == "moderate" else "moderate"
    passing_score = 15

    cursor.execute(
        "SELECT id FROM test_attempts WHERE user_id=%s AND topic=%s AND mode=%s AND score>=%s LIMIT 1",
        (req.userId, req.topic, prev_mode, passing_score)
    )
    return {"unlocked": bool(cursor.fetchone())}

@app.post("/api/test/best-score")
def get_best_score(req: BestScoreRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute(
        "SELECT MAX(score) as best_score FROM test_attempts WHERE user_id=%s AND topic=%s AND mode=%s",
        (req.userId, req.topic, req.mode)
    )
    result = cursor.fetchone()
    return {"best_score": result["best_score"] if result and result["best_score"] is not None else None}

@app.get("/api/leaderboard")
def get_leaderboard(timeframe: str = "all", db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        # 1. Define Date Filter
        # If timeframe is 'week', filter for last 7 days. Otherwise, empty string (all time).
        date_clause = "AND t.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)" if timeframe == "week" else ""
        
        # 2. Execute Query
        # We use LEFT JOINs to ensure users with 0 attempts still show up (or you can use inner logic)
        # But this specific query sums up XP from 3 sources: Aptitude, Coding, Interview
        query = f"""
        SELECT 
            u.id, 
            u.fname, 
            u.lname, 
            u.profile_picture_url,
            (
                /* 1. Aptitude XP: 10 XP per score point */
                COALESCE((
                    SELECT SUM(score * 10) 
                    FROM test_attempts 
                    WHERE user_id = u.id {date_clause.replace('t.', '')}
                ), 0) + 
                
                /* 2. Coding XP: Easy=50, Medium=100, Hard=200 */
                COALESCE((
                    SELECT SUM(
                        CASE 
                            WHEN difficulty = 'easy' THEN 50 
                            WHEN difficulty = 'medium' THEN 100 
                            WHEN difficulty = 'hard' THEN 200 
                            ELSE 0 
                        END
                    ) 
                    FROM coding_attempts 
                    WHERE user_id = u.id AND is_correct = 1 {date_clause.replace('t.', '')}
                ), 0) +

                /* 3. Interview XP: 100 base + (Score * 20) */
                COALESCE((
                    SELECT SUM(100 + (overall_score * 20)) 
                    FROM interview_attempts 
                    WHERE user_id = u.id {date_clause.replace('t.', '')}
                ), 0)
            ) as total_xp,
            
            /* Count total coding problems solved */
            (
                SELECT COUNT(*) 
                FROM coding_attempts 
                WHERE user_id = u.id AND is_correct = 1 {date_clause.replace('t.', '')}
            ) as problems_solved

        FROM users u
        ORDER BY total_xp DESC
        LIMIT 10;
        """
        
        cursor.execute(query)
        leaderboard = cursor.fetchall()
        return leaderboard

    except Exception as e:
        print(f"❌ Leaderboard Error: {e}") # Check your VS Code terminal for this log
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@app.get("/api/user/{user_id}/gamification")
def get_user_stats(user_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        # Calculate User Rank
        # Note: In a real production app, you'd cache this. For now, we calculate on fly.
        cursor.execute("SELECT id FROM users")
        all_users = [u['id'] for u in cursor.fetchall()]
        
        # This is a simplified logic for "Level". Level = sqrt(XP) / 10
        # Re-using the XP logic from above would be cleaner in a shared function, 
        # but for simplicity, we assume frontend fetches leaderboard to find rank.
        
        return {
            "level": 5, # Placeholder: Implement calculation logic based on XP
            "badges": ["First Code", "Interview Ace"], # Placeholder for Badge table
            "streak": 3
        }
    except Exception as e:
        print(e)
        return {"level": 1, "badges": [], "streak": 0}
    
# --- ADD TO backend/main.py ---

@app.get("/api/leaderboard/filter")
def get_filtered_leaderboard(
    category: str, # 'aptitude', 'technical', 'coding', 'interview'
    topic: str = None, 
    difficulty: str = None, 
    db_cursor: tuple = Depends(get_cursor)
):
    cursor, db = db_cursor
    try:
        # Base Query Structure
        query = ""
        params = []

        # 1. APTITUDE & TECHNICAL LOGIC (Shared Table: test_attempts)
        if category in ["aptitude", "technical"]:
            # Determine topics based on category to filter garbage data
            # Note: In a real app, you might have a 'category' column in test_attempts
            query = """
            SELECT 
                u.id, u.fname, u.lname, u.profile_picture_url,
                SUM(t.score) as score,
                COUNT(t.id) as attempts
            FROM users u
            JOIN test_attempts t ON u.id = t.user_id
            WHERE 1=1
            """
            
            if topic and topic != "all":
                query += " AND t.topic = %s"
                params.append(topic)
            
            if difficulty and difficulty != "all":
                query += " AND t.mode = %s" # 'mode' stores difficulty (easy/moderate/hard)
                params.append(difficulty)
            
            # Logic to separate Aptitude vs Technical topics could be added here 
            # if you have a way to distinguish them in DB, otherwise it relies on the 'topic' filter.

            query += " GROUP BY u.id ORDER BY score DESC LIMIT 10"

        # 2. CODING LOGIC (Table: coding_attempts)
        elif category == "coding":
            query = """
            SELECT 
                u.id, u.fname, u.lname, u.profile_picture_url,
                COUNT(DISTINCT c.problem_title) * (CASE WHEN %s = 'hard' THEN 20 WHEN %s = 'medium' THEN 10 ELSE 5 END) as score,
                COUNT(DISTINCT c.problem_title) as attempts
            FROM users u
            JOIN coding_attempts c ON u.id = c.user_id
            WHERE c.is_correct = 1
            """
            # We inject difficulty for score calculation logic
            params.append(difficulty if difficulty else 'easy') 
            params.append(difficulty if difficulty else 'easy')

            if difficulty and difficulty != "all":
                query += " AND c.difficulty = %s"
                params.append(difficulty)
            
            query += " GROUP BY u.id ORDER BY score DESC LIMIT 10"

        # 3. INTERVIEW LOGIC (Table: interview_attempts)
        elif category == "interview":
            query = """
            SELECT 
                u.id, u.fname, u.lname, u.profile_picture_url,
                ROUND(AVG(i.overall_score), 1) as score,
                COUNT(i.id) as attempts
            FROM users u
            JOIN interview_attempts i ON u.id = i.user_id
            WHERE 1=1
            """
            if topic and topic != "all":
                query += " AND i.job_role = %s" # Filter by Job Role
                params.append(topic)

            query += " GROUP BY u.id ORDER BY score DESC LIMIT 10"

        else:
            return []

        cursor.execute(query, tuple(params))
        return cursor.fetchall()

    except Exception as e:
        print(f"Filter Leaderboard Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    