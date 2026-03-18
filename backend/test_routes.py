import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict
from database import get_cursor
from datetime import datetime

router = APIRouter(prefix="/api/tests", tags=["Scheduled Tests"])

class SubmitTestReq(BaseModel):
    user_id: int
    user_name: str
    answers: Dict[int, str] # { question_index: "Selected Option" }

@router.get("/available")
def get_available_tests(user_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    # Get all tests, and check if user already attempted them
    cursor.execute("""
        SELECT t.id, t.title, t.test_category, t.scheduled_time, t.duration_minutes,
               (SELECT COUNT(*) FROM test_results WHERE test_id = t.id AND user_id = %s) as is_attempted
        FROM scheduled_tests t
        ORDER BY t.scheduled_time DESC
    """, (user_id,))
    return cursor.fetchall()

@router.get("/{test_id}/start")
def start_test(test_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT * FROM scheduled_tests WHERE id = %s", (test_id,))
    test = cursor.fetchone()
    if not test: raise HTTPException(status_code=404, detail="Test not found")

    # Only return questions without the 'ans' and 'exp' fields to prevent cheating
    questions = json.loads(test['questions'])
    safe_questions = [{"q": q["q"], "options": q["options"], "diff": q.get("diff", "Medium")} for q in questions]

    return {
        "title": test['title'],
        "duration": test['duration_minutes'],
        "questions": safe_questions
    }

@router.post("/{test_id}/submit")
def submit_test(test_id: int, req: SubmitTestReq, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT questions FROM scheduled_tests WHERE id = %s", (test_id,))
    test = cursor.fetchone()
    
    questions = json.loads(test['questions'])
    score = 0
    total = len(questions)

    # Calculate Score
    for idx_str, user_ans in req.answers.items():
        idx = int(idx_str)
        if questions[idx]['ans'] == user_ans:
            score += 1

    # Save Result
    cursor.execute(
        "INSERT INTO test_results (test_id, user_id, user_name, score, total, answers) VALUES (%s, %s, %s, %s, %s, %s)",
        (test_id, req.user_id, req.user_name, score, total, json.dumps(req.answers))
    )
    db.commit()
    return {"message": "Test submitted!", "score": score, "total": total}

@router.get("/{test_id}/report")
def get_test_report(test_id: int, user_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    
    # 1. Get Leaderboard
    cursor.execute("SELECT user_name, score, total FROM test_results WHERE test_id = %s ORDER BY score DESC", (test_id,))
    leaderboard = cursor.fetchall()

    # 2. Get User's specific report (to show mistakes)
    cursor.execute("SELECT answers FROM test_results WHERE test_id = %s AND user_id = %s", (test_id, user_id))
    user_result = cursor.fetchone()
    
    cursor.execute("SELECT questions FROM scheduled_tests WHERE id = %s", (test_id,))
    questions_data = cursor.fetchone()
    
    if not user_result or not questions_data:
        return {"leaderboard": leaderboard, "report": []}

    questions = json.loads(questions_data['questions'])
    user_answers = json.loads(user_result['answers'])

    report = []
    for i, q in enumerate(questions):
        u_ans = user_answers.get(str(i), "Not Answered")
        report.append({
            "question": q["q"],
            "options": q["options"],
            "correct_ans": q["ans"],
            "user_ans": u_ans,
            "is_correct": u_ans == q["ans"],
            "explanation": q.get("exp", "")
        })

    return {"leaderboard": leaderboard, "report": report}