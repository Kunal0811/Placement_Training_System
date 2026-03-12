# backend/gd_models.py
import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, Boolean, JSON
from database import Base

class GDSession(Base):
    __tablename__ = "gd_sessions"
    id = Column(Integer, primary_key=True, index=True)
    topic_category = Column(String(100))
    topic = Column(String(255), nullable=True)
    max_seats = Column(Integer, default=6)
    booked_seats = Column(Integer, default=0)
    duration = Column(Integer, default=15)
    prep_time = Column(Integer, default=2)
    scheduled_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="open")

class GDBooking(Base):
    __tablename__ = "gd_bookings"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("gd_sessions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    joined = Column(Boolean, default=False)

class GDEvaluation(Base):
    __tablename__ = "gd_evaluations"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("gd_sessions.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
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