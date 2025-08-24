from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    module = Column(String(50), index=True)           # e.g. "Aptitude"
    topic = Column(String(100), index=True)           # e.g. "Percentages"
    difficulty = Column(String(20), index=True)       # "easy" | "medium" | "hard"
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)             # ["A", "B", "C", "D"]
    correct_answer = Column(String(10), nullable=False)
    explanation = Column(Text, nullable=True)
    source = Column(String(50), default="ai")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    module = Column(String(50), index=True)
    topic = Column(String(100), index=True, nullable=True)
    difficulty = Column(String(20), index=True)
    question_ids = Column(JSON, nullable=False)       # [1,2,...]
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"), nullable=False)
    user_id = Column(String(100), nullable=True)      # optional (your FE can send email or uid)
    responses = Column(JSON, nullable=False)          # [{question_id, selected, correct}]
    score = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    test = relationship("Test")
