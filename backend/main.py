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

# Import from the new database file and other route files
from database import get_cursor
from aptitude_routes import router as aptitude_router
from technical_routes import router as technical_router
from coding_routes import router as coding_router

# --- Setup ---
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI(title="Placify Backend", version="1.0.0")

# --- Mount Static Files Directory ---
# This makes files in the 'static' folder accessible via the /static URL
os.makedirs("static/profile_pics", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


# --- CORS Middleware ---
allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
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

    return {"user": user, "tests": tests, "coding": coding_attempts}

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