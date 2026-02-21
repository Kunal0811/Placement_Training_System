# backend/interview_models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) # Link to your User table if exists
    job_role = Column(String(100))
    difficulty = Column(String(50))
    interview_type = Column(String(50)) # HR, Technical, Managerial
    topic = Column(String(100))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    overall_score = Column(Float, nullable=True)
    feedback_summary = Column(Text, nullable=True)

    turns = relationship("InterviewTurn", back_populates="session")

class InterviewTurn(Base):
    __tablename__ = "interview_turns"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    
    question_text = Column(Text)
    question_type = Column(String(50)) # Behavioral, Technical
    
    user_answer_text = Column(Text, nullable=True)
    user_answer_audio_url = Column(String(255), nullable=True) # Optional if we store audio
    
    ai_score = Column(Integer, nullable=True) # 0-10
    ai_feedback = Column(Text, nullable=True)
    ai_suggested_answer = Column(Text, nullable=True)
    
    turn_number = Column(Integer)

    session = relationship("InterviewSession", back_populates="turns")