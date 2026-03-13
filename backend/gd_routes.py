import os
import json
from typing import Dict
from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from google import genai
from database import get_cursor
from datetime import datetime
import smtplib
from email.message import EmailMessage

router = APIRouter(prefix="/api/gd", tags=["Group Discussion"])

def send_notification_email(to_email: str, subject: str, body: str):
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = os.getenv("EMAIL_USER")
        msg["To"] = to_email
        msg.set_content(body)
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
            smtp.send_message(msg)
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

class CreateSessionReq(BaseModel):
    host_id: int
    host_name: str
    scheduled_time: str

class JoinSessionReq(BaseModel):
    session_id: int
    user_id: int
    user_name: str

class EvaluateReq(BaseModel):
    session_id: int
    topic: str

# --- 1. REST APIs for Lobby ---

@router.post("/create")
async def create_session(req: CreateSessionReq, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        # 1. Generate Topic immediately when session is created
        api_key = os.getenv("GEMINI_API_KEY_INTERVIEW") or os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)
        prompt = "Generate exactly ONE highly debated, single-sentence topic for a college student group discussion (Tech, Business, or Ethics). Return ONLY the topic string, no quotes or intro."
        response = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        ai_topic = response.text.strip().strip('"').strip("'")

        # 2. Insert Session with the generated topic
        cursor.execute(
            "INSERT INTO gd_sessions (host_id, host_name, scheduled_time, topic, status) VALUES (%s, %s, %s, %s, %s)",
            (req.host_id, req.host_name, req.scheduled_time, ai_topic, "scheduled")
        )
        session_id = cursor.lastrowid
        
        # 3. Add host as participant
        cursor.execute(
            "INSERT INTO gd_participants (session_id, user_id, user_name) VALUES (%s, %s, %s)",
            (session_id, req.host_id, req.host_name)
        )
        db.commit()

        # 4. Notify others
        cursor.execute("SELECT email FROM users WHERE id != %s", (req.host_id,))
        users = cursor.fetchall()
        time_formatted = datetime.fromisoformat(req.scheduled_time).strftime("%B %d, %Y at %I:%M %p")
        
        for u in users:
            body = f"Hello,\n\n{req.host_name} has scheduled a Group Discussion session.\nTime: {time_formatted}\nThe topic will be revealed by AI at the start of the session.\n\nLogin to Placify to book your spot!"
            send_notification_email(u['email'], "New Live GD Scheduled!", body)

        return {"message": "Session created, AI generated the topic, and users notified!", "session_id": session_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
def get_sessions(db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("""
        SELECT s.id, s.host_id, s.host_name as host, s.scheduled_time as time, s.topic, s.status,
               (SELECT COUNT(*) FROM gd_participants WHERE session_id = s.id) as participants,
               (SELECT GROUP_CONCAT(user_id) FROM gd_participants WHERE session_id = s.id) as participant_ids
        FROM gd_sessions s
        WHERE s.status IN ('scheduled', 'active')
        ORDER BY s.scheduled_time ASC
    """)
    return cursor.fetchall()

@router.post("/book")
def book_session(req: JoinSessionReq, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        cursor.execute("SELECT COUNT(*) as count FROM gd_participants WHERE session_id = %s", (req.session_id,))
        if cursor.fetchone()['count'] >= 6:
            raise HTTPException(status_code=400, detail="Room is full")
            
        cursor.execute(
            "INSERT IGNORE INTO gd_participants (session_id, user_id, user_name) VALUES (%s, %s, %s)",
            (req.session_id, req.user_id, req.user_name)
        )
        db.commit()
        return {"message": "Seat booked successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. WEBSOCKETS FOR LIVE ROOM ---

class GDConnectionManager:
    def __init__(self):
        self.rooms: Dict[str, Dict] = {}

    async def connect(self, websocket: WebSocket, session_id: str, user_id: str, user_name: str):
        await websocket.accept()
        if session_id not in self.rooms:
            self.rooms[session_id] = {"participants": {}, "transcript": []}
        
        # Using user_id instead of user_name so two people with the same name don't overwrite each other
        self.rooms[session_id]["participants"][user_id] = websocket
        await self.broadcast(session_id, {"type": "system", "text": f"{user_name} joined."})

    def disconnect(self, session_id: str, user_id: str, user_name: str):
        if session_id in self.rooms and user_id in self.rooms[session_id]["participants"]:
            del self.rooms[session_id]["participants"][user_id]

    async def broadcast(self, session_id: str, message: dict):
        if session_id in self.rooms:
            if message.get("type") == "user_message":
                self.rooms[session_id]["transcript"].append(message)
            for ws in self.rooms[session_id]["participants"].values():
                await ws.send_json(message)

manager = GDConnectionManager()

# Updated WebSocket URL to accept user_id
@router.websocket("/ws/{session_id}/{user_id}/{user_name}")
async def gd_websocket(websocket: WebSocket, session_id: str, user_id: str, user_name: str):
    await manager.connect(websocket, session_id, user_id, user_name)
    try:
        while True:
            data = await websocket.receive_text()
            if data.startswith("SYS_CMD:"):
                await manager.broadcast(session_id, {"type": "system_command", "cmd": data.replace("SYS_CMD:", "")})
            else:
                await manager.broadcast(session_id, {"type": "user_message", "user": user_name, "text": data})
    except WebSocketDisconnect:
        manager.disconnect(session_id, user_id, user_name)
        await manager.broadcast(session_id, {"type": "system", "text": f"{user_name} left."})

# --- 3. AI EVALUATION ---

@router.post("/evaluate")
async def evaluate_gd(req: EvaluateReq, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    room_data = manager.rooms.get(str(req.session_id))
    
    transcript_text = "Silent room. No one spoke."
    if room_data and room_data["transcript"]:
        transcript_text = "\n".join([f"{msg['user']}: {msg['text']}" for msg in room_data["transcript"]])
    
    prompt = f"""
    You are an expert HR Interviewer. Analyze this Group Discussion transcript.
    Topic: {req.topic}
    Transcript:
    {transcript_text}

    Evaluate EVERY participant who spoke (or if none, evaluate a placeholder user named 'Test User') based on 5 metrics (each out of 10):
    1. Clarity 2. Confidence 3. Logic 4. Communication 5. Leadership.
    
    Return STRICT JSON array exactly like this:
    [
      {{
        "user_name": "Test User", "clarity": 5, "confidence": 5, "logic": 5, "communication": 5, "leadership": 5,
        "total": 25, "strengths": ["Good point"], "weaknesses": ["Spoke too fast"], "advice": "Please speak clearly."
      }}
    ]
    """
    try:
        api_key = os.getenv("GEMINI_API_KEY_GD") or os.getenv("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)
        response = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        
        cleaned = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(cleaned)
        
        cursor.execute("UPDATE gd_sessions SET status='completed' WHERE id=%s", (req.session_id,))
        db.commit()

        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))