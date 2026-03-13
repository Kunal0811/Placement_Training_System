# backend/gd_models.py
import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from database import Base

class GDSession(Base):
    __tablename__ = "gd_sessions"
    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    host_name = Column(String(255))
    scheduled_time = Column(String(100))
    topic = Column(String(255), nullable=True)
    status = Column(String(50), default="scheduled")

class GDParticipant(Base):
    __tablename__ = "gd_participants"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("gd_sessions.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    user_name = Column(String(255))

class GDEvaluation(Base):
    __tablename__ = "gd_evaluations"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("gd_sessions.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    overall_score = Column(Float)
    communication = Column(Float)
    content = Column(Float)
    confidence = Column(Float)
    leadership = Column(Float)
    clarity = Column(Float)
    strengths = Column(JSON)
    improvements = Column(JSON)
    ideal_response = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)