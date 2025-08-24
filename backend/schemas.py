from pydantic import BaseModel, Field
from typing import List, Optional, Literal

Difficulty = Literal["easy", "medium", "hard"]

class QuestionCreate(BaseModel):
    module: str = "Aptitude"
    topic: str
    difficulty: Difficulty = "medium"
    question_text: str
    options: List[str] = Field(default_factory=list)
    correct_answer: str
    explanation: Optional[str] = None
    source: str = "ai"

class QuestionOut(BaseModel):
    id: int
    module: str
    topic: str
    difficulty: Difficulty
    question_text: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str]
    source: str

    class Config:
        from_attributes = True

class GenerateQuestionsIn(BaseModel):
    module: str = "Aptitude"
    topic: str
    difficulty: Difficulty = "medium"
    count: int = 20

class GenerateQuestionsOut(BaseModel):
    created_ids: List[int]

class TestCreate(BaseModel):
    module: str = "Aptitude"
    topic: Optional[str] = None
    difficulty: Difficulty = "medium"
    question_ids: List[int]

class TestOut(BaseModel):
    id: int
    module: str
    topic: Optional[str]
    difficulty: Difficulty
    question_ids: List[int]

    class Config:
        from_attributes = True

class AttemptCreate(BaseModel):
    test_id: int
    user_id: Optional[str] = None
    responses: List[dict]  # [{question_id:int, selected:str}]
    
class AttemptOut(BaseModel):
    id: int
    test_id: int
    user_id: Optional[str]
    responses: List[dict]
    score: int

    class Config:
        from_attributes = True
