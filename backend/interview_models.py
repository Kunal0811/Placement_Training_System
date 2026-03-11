# backend/interview_models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True) 
    job_role = Column(String(100))
    difficulty = Column(String(50))
    interview_type = Column(String(50)) 
    topic = Column(String(100))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    
    # --- NEW: Detailed Metrics ---
    overall_score = Column(Float, nullable=True)
    communication_score = Column(Float, nullable=True)
    technical_score = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)
    problem_solving_score = Column(Float, nullable=True)
    
    # Store the entire final JSON report here for easy retrieval
    feedback_summary = Column(Text, nullable=True) 

    turns = relationship("InterviewTurn", back_populates="session")

class InterviewTurn(Base):
    __tablename__ = "interview_turns"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"))
    
    question_text = Column(Text)
    question_type = Column(String(50)) 
    
    user_answer_text = Column(Text, nullable=True)
    turn_number = Column(Integer)

    session = relationship("InterviewSession", back_populates="turns")