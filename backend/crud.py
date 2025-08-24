from sqlalchemy.orm import Session
from typing import List
from models import Question, Test, Attempt
from schemas import QuestionCreate, TestCreate, AttemptCreate

def create_questions(db: Session, items: List[QuestionCreate]) -> List[Question]:
    objs = [Question(**item.dict()) for item in items]
    db.add_all(objs)
    db.commit()
    for o in objs:
        db.refresh(o)
    return objs

def get_questions(db: Session, module: str = None, topic: str = None, limit: int = 50):
    q = db.query(Question)
    if module:
        q = q.filter(Question.module == module)
    if topic:
        q = q.filter(Question.topic == topic)
    return q.order_by(Question.id.desc()).limit(limit).all()

def create_test(db: Session, payload: TestCreate) -> Test:
    test = Test(**payload.dict())
    db.add(test)
    db.commit()
    db.refresh(test)
    return test

def get_test(db: Session, test_id: int) -> Test:
    return db.query(Test).filter(Test.id == test_id).first()

def create_attempt(db: Session, payload: AttemptCreate, correct_map: dict) -> Attempt:
    # score
    score = 0
    graded = []
    for r in payload.responses:
        qid = r["question_id"]
        selected = r["selected"]
        correct = correct_map.get(qid)
        graded.append({**r, "correct": correct, "is_correct": selected == correct})
        if selected == correct:
            score += 1

    attempt = Attempt(
        test_id=payload.test_id,
        user_id=payload.user_id,
        responses=graded,
        score=score,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt
