import os
import json
import smtplib
import asyncio
import mysql.connector
from email.message import EmailMessage
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from database import get_cursor
from passlib.hash import bcrypt
from google import genai

router = APIRouter(prefix="/api/admin", tags=["Admin"])

class AdminLoginReq(BaseModel):
    admin_id: str
    password: str

class ScheduleTestReq(BaseModel):
    title: str
    category: str
    scheduled_time: str
    duration: int

def send_mass_email(emails, subject, body):
    try:
        msg = EmailMessage()
        msg["Subject"] = subject
        msg["From"] = os.getenv("EMAIL_USER")
        msg.set_content(body)
        
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
            for email in emails:
                msg["To"] = email
                smtp.send_message(msg)
                del msg["To"]
    except Exception as e:
        print(f"Mass email failed: {e}")

@router.post("/login")
def admin_login(req: AdminLoginReq, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT * FROM admins WHERE admin_id = %s", (req.admin_id,))
    admin = cursor.fetchone()

    if not admin or not bcrypt.verify(req.password, admin['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid Admin ID or Password")
    
    return {
        "message": "Login successful",
        "user": {"id": admin['id'], "admin_id": admin['admin_id'], "name": admin['name'], "role": "admin"}
    }

@router.get("/stats")
def get_admin_stats(db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT COUNT(*) as count FROM users")
    users = cursor.fetchone()['count']
    cursor.execute("SELECT COUNT(*) as count FROM scheduled_tests")
    tests = cursor.fetchone()['count']
    return {"total_users": users, "total_tests": tests}

@router.get("/tests")
def get_all_tests(db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("SELECT id, title, test_category, scheduled_time, duration_minutes, status FROM scheduled_tests ORDER BY scheduled_time DESC")
    return cursor.fetchall()

@router.delete("/tests/{test_id}")
def delete_test(test_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("DELETE FROM scheduled_tests WHERE id = %s", (test_id,))
    db.commit()
    return {"message": "Test deleted successfully"}

# --- HELPER: Async chunk fetching ---
async def fetch_question_chunk_async(client, category: str, diff: str, count: int):
    prompt = f"""
    Generate exactly {count} distinct multiple-choice questions for a {category} assessment.
    DIFFICULTY LEVEL: {diff}.
    
    Return STRICTLY a valid JSON array of objects. DO NOT wrap in markdown formatting.
    [
        {{
            "q": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "ans": "Option A",
            "diff": "{diff}",
            "exp": "Short explanation of why this answer is correct."
        }}
    ]
    """
    print(f"⏳ Background: Generating {count} {diff} questions...")
    for attempt in range(3):
        try:
            response = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            cleaned = response.text.replace("```json", "").replace("```", "").strip()
            start_idx, end_idx = cleaned.find('['), cleaned.rfind(']')
            if start_idx != -1 and end_idx != -1:
                cleaned = cleaned[start_idx:end_idx+1]
            data = json.loads(cleaned)
            print(f"✅ Background: Successfully generated {len(data)} {diff} questions!")
            return data
        except Exception as e:
            print(f"⚠️ Background: Attempt {attempt+1} failed for {diff}: {e}")
            await asyncio.sleep(5)
    return []

# --- NEW: Get all users ---
@router.get("/users")
def get_all_users(db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    cursor.execute("""
        SELECT id, fname, lname, email, created_at 
        FROM users 
        ORDER BY created_at DESC
    """)
    return cursor.fetchall()

# --- NEW: Delete a user ---
# --- UPDATED: Force Delete a user and all their history ---
@router.delete("/users/{user_id}")
def delete_user(user_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        print(f"🗑️ Attempting to delete user {user_id} and all their data...")
        
        # 1. Manually clean up all dependent records so MySQL doesn't block the deletion
        cursor.execute("DELETE FROM test_results WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM coding_attempts WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM gd_participants WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM gd_evaluations WHERE user_id = %s", (user_id,))
        
        # For interviews, we must delete the questions linked to their sessions first
        cursor.execute("DELETE FROM interview_attempts WHERE id IN (SELECT id FROM interview_sessions WHERE user_id = %s)", (user_id,))
        cursor.execute("DELETE FROM interview_sessions WHERE user_id = %s", (user_id,))
        
        # 2. Disable Foreign Key checks temporarily just in case there are other obscure tables
        cursor.execute("SET FOREIGN_KEY_CHECKS=0")
        
        # 3. Finally, delete the user account
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        
        # 4. Turn checks back on and commit
        cursor.execute("SET FOREIGN_KEY_CHECKS=1")
        db.commit()
        
        print(f"✅ Successfully deleted user {user_id}")
        return {"message": "User and all associated data deleted successfully"}
        
    except Exception as e:
        db.rollback()
        # Always turn checks back on if something fails!
        cursor.execute("SET FOREIGN_KEY_CHECKS=1") 
        print(f"❌ Error deleting user: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete user from database.")

# --- THE BACKGROUND TASK: Follows your exact logic! ---
async def generate_test_background(test_id: int, req: ScheduleTestReq):
    print(f"🚀 Background Task Started for Test ID {test_id}")
    api_key = os.getenv("GEMINI_API_KEY_APTITUDE") or os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    # 1. 10 Easy Questions
    easy_qs = await fetch_question_chunk_async(client, req.category, "Easy", 10)
    print("😴 Sleeping for 60 seconds to reset rate limit...")
    await asyncio.sleep(60)

    # 2. 15 Medium Questions
    med_qs = await fetch_question_chunk_async(client, req.category, "Medium", 15)
    print("😴 Sleeping for 60 seconds to reset rate limit...")
    await asyncio.sleep(60)

    # 3. 15 Hard Questions (Chunk 1)
    hard_qs_1 = await fetch_question_chunk_async(client, req.category, "Hard", 15)
    print("😴 Sleeping for 60 seconds to reset rate limit...")
    await asyncio.sleep(60)

    # 4. 10 Hard Questions (Chunk 2)
    hard_qs_2 = await fetch_question_chunk_async(client, req.category, "Hard", 10)

    all_questions = easy_qs + med_qs + hard_qs_1 + hard_qs_2
    print(f"🎉 Background Task Finished Generation. Total: {len(all_questions)}")

    # We must open a new database connection inside the background task
    try:
        db = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "placify")
        )
        cursor = db.cursor(dictionary=True)
        
        # Save questions to the DB
        questions_json = json.dumps(all_questions)
        cursor.execute("UPDATE scheduled_tests SET questions = %s WHERE id = %s", (questions_json, test_id))
        db.commit()

        # Email Students
        cursor.execute("SELECT email FROM users")
        emails = [u['email'] for u in cursor.fetchall()]

        email_body = f"Hello Student,\n\nA new {req.category.capitalize()} test has been scheduled!\nTest: {req.title}\nTime: {req.scheduled_time}\nDuration: {req.duration} mins\n\nYou MUST start the test within 10 minutes of the scheduled time.\n\nBest of luck!"
        send_mass_email(emails, f"New Scheduled Test: {req.title}", email_body)
        print("✅ Emails sent in background.")

    except Exception as e:
        print(f"❌ Background DB/Email Error: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'db' in locals(): db.close()

# --- NEW: Get Leaderboard/Results for a specific test ---
@router.get("/tests/{test_id}/results")
def get_test_results(test_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        # Join test_results with users to get their email as well
        cursor.execute("""
            SELECT r.user_id, r.user_name, r.score, r.total, r.created_at, u.email
            FROM test_results r
            JOIN users u ON r.user_id = u.id
            WHERE r.test_id = %s
            ORDER BY r.score DESC, r.created_at ASC
        """, (test_id,))
        return cursor.fetchall()
    except Exception as e:
        print(f"Error fetching results: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch test results")

# --- NEW: Background Task for Coding Tests (1 Easy, 1 Med, 1 Hard) ---
async def generate_coding_test_background(test_id: int, req: ScheduleTestReq):
    print(f"🚀 Background Task Started for Coding Test ID {test_id}")
    api_key = os.getenv("GEMINI_API_KEY_INTERVIEW") or os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    prompt = """
    Generate exactly 3 distinct coding challenges for a programming assessment.
    DIFFICULTY BREAKDOWN: Exactly 1 Easy, 1 Medium, and 1 Hard.
    
    Return STRICTLY a valid JSON array of objects. DO NOT wrap in markdown formatting.
    [
        {
            "title": "Problem Name",
            "description": "Detailed problem statement...",
            "difficulty": "Easy",
            "test_cases": [
                {"input": "2 3", "expected_output": "5"}
            ],
            "starter_code": {
                "python": "def solve(a, b):\n    # Write your code here\n    pass",
                "java": "class Solution {\n    public int solve(int a, int b) {\n        // Write your code here\n        return 0;\n    }\n}",
                "cpp": "class Solution {\npublic:\n    int solve(int a, int b) {\n        // Write your code here\n        return 0;\n    }\n};"
            },
            "driver_code": {
                "python": "\nimport sys\nif __name__ == '__main__':\n    input_data = sys.stdin.read().split()\n    if input_data:\n        print(solve(int(input_data[0]), int(input_data[1])))",
                "java": "\nimport java.util.*;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int a = sc.nextInt();\n            int b = sc.nextInt();\n            Solution sol = new Solution();\n            System.out.println(sol.solve(a, b));\n        }\n    }\n}",
                "cpp": "\n#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    if(cin >> a >> b) {\n        Solution sol;\n        cout << sol.solve(a, b) << endl;\n    }\n    return 0;\n}"
            }
        }
    ]
    IMPORTANT RULES FOR DRIVER CODE: 
    1. The user's starter code will be pasted EXACTLY ABOVE your driver code in the final execution file.
    2. The driver code MUST parse standard input, call the user's function/class, and print the result.
    3. In Java, DO NOT make the user's class 'public'. ONLY the driver code should have 'public class Main'.
    """
    
    all_questions = []
    for attempt in range(3):
        try:
            print(f"⏳ Generating Coding Questions (Attempt {attempt+1})...")
            response = await client.aio.models.generate_content(model="gemini-2.5-flash", contents=prompt)
            cleaned = response.text.replace("```json", "").replace("```", "").strip()
            start_idx, end_idx = cleaned.find('['), cleaned.rfind(']')
            if start_idx != -1 and end_idx != -1:
                all_questions = json.loads(cleaned[start_idx:end_idx+1])
                break
        except Exception as e:
            print(f"⚠️ Coding Gen Error: {e}")
            await asyncio.sleep(5)

    print(f"🎉 Background Task Finished Coding Generation. Total: {len(all_questions)}")

    try:
        db = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"), user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""), database=os.getenv("DB_NAME", "placify")
        )
        cursor = db.cursor(dictionary=True)
        cursor.execute("UPDATE scheduled_tests SET questions = %s WHERE id = %s", (json.dumps(all_questions), test_id))
        db.commit()

        cursor.execute("SELECT email FROM users")
        emails = [u['email'] for u in cursor.fetchall()]
        email_body = f"Hello Student,\n\nA new Coding Assessment has been scheduled!\nTest: {req.title}\nTime: {req.scheduled_time}\nDuration: {req.duration} mins\n\nYou MUST start the test within 10 minutes of the scheduled time.\n\nBest of luck!"
        send_mass_email(emails, f"New Scheduled Coding Test: {req.title}", email_body)
    except Exception as e:
        print(f"❌ Background DB/Email Error: {e}")
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'db' in locals(): db.close()


@router.post("/schedule-test")
def schedule_test(req: ScheduleTestReq, background_tasks: BackgroundTasks, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        cursor.execute(
            "INSERT INTO scheduled_tests (title, test_category, scheduled_time, duration_minutes, questions) VALUES (%s, %s, %s, %s, %s)",
            (req.title, req.category, req.scheduled_time, req.duration, "[]")
        )
        db.commit()
        test_id = cursor.lastrowid

        # 🔥 ROUTE LOGIC: Run different AI generators based on the Category
        if req.category.lower() == "coding":
            background_tasks.add_task(generate_coding_test_background, test_id, req)
            return {"message": "Coding Test scheduling started! AI is generating 3 problems in the background (takes ~15 secs)."}
        else:
            background_tasks.add_task(generate_test_background, test_id, req)
            return {"message": "MCQ Test scheduling started! AI is generating 50 questions in the background (takes ~3 mins)."}
            
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to initiate schedule: {str(e)}")

# --- NEW: Get 360° Student Profile ---
# --- UPDATED: Get 360° Student Profile (With Deep Analytics) ---
@router.get("/users/{user_id}/profile")
def get_student_profile(user_id: int, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        # 1. Basic Info
        cursor.execute("SELECT id, fname, lname, email, created_at FROM users WHERE id = %s", (user_id,))
        user_info = cursor.fetchone()
        if not user_info: raise HTTPException(status_code=404, detail="User not found")

        # 2. Test History & Trends
        cursor.execute("""
            SELECT t.title, t.test_category, r.score, r.total, r.created_at 
            FROM test_results r 
            JOIN scheduled_tests t ON r.test_id = t.id 
            WHERE r.user_id = %s 
            ORDER BY r.created_at DESC
        """, (user_id,))
        tests = cursor.fetchall()

        # Format data for Recharts (Line Chart)
        test_trend = []
        category_stats = {}
        
        for i, t in enumerate(reversed(tests[:10])): # Get last 10 tests in chronological order
            pct = round((t['score'] / max(1, t['total'])) * 100)
            test_trend.append({"name": f"Test {i+1}", "score": pct})
            
            # Group for Bar Chart
            cat = t['test_category'].capitalize()
            if cat not in category_stats:
                category_stats[cat] = {'score': 0, 'total': 0}
            category_stats[cat]['score'] += t['score']
            category_stats[cat]['total'] += t['total']

        # Format data for Recharts (Bar Chart)
        subject_mastery = [
            {"subject": k, "accuracy": round((v['score'] / max(1, v['total'])) * 100)} 
            for k, v in category_stats.items()
        ]

        # Weakness Detection
        weakest_subject = "None"
        if subject_mastery:
            weakest_subject = min(subject_mastery, key=lambda x: x['accuracy'])['subject']

        # 3. Coding Analytics
        cursor.execute("""
            SELECT difficulty, COUNT(DISTINCT problem_title) as solved 
            FROM coding_attempts 
            WHERE user_id = %s AND is_correct = 1 
            GROUP BY difficulty
        """, (user_id,))
        coding_stats = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
        for row in cursor.fetchall():
            diff = row['difficulty'].lower()
            coding_stats[diff] = row['solved']
            coding_stats['total'] += row['solved']

        # 4. Soft Skills & Gamification
        cursor.execute("SELECT COUNT(*) as count, AVG(overall_score) as avg_score FROM interview_sessions WHERE user_id = %s", (user_id,))
        int_data = cursor.fetchone()
        cursor.execute("SELECT COUNT(*) as count FROM gd_participants WHERE user_id = %s", (user_id,))
        gd_data = cursor.fetchone()

        soft_skills = {
            "interviews_taken": int_data['count'],
            "avg_interview_score": round(int_data['avg_score'] or 0, 1),
            "gds_attended": gd_data['count']
        }

        # 5. Calculate Health Score
        health_score = 100
        test_avg = sum([t['score'] for t in test_trend]) / len(test_trend) if test_trend else 0
        
        if not tests: health_score -= 30
        if test_avg < 50: health_score -= 20
        elif test_avg < 75: health_score -= 10
        if coding_stats['total'] < 5: health_score -= 20
        elif coding_stats['total'] < 15: health_score -= 10

        health_score = max(0, min(100, int(health_score)))

        if health_score >= 80: readiness = "Placement Ready"
        elif health_score >= 50: readiness = "Needs Practice"
        else: readiness = "At Risk"

        return {
            "user": user_info,
            "health_score": health_score,
            "readiness": readiness,
            "test_avg": round(test_avg, 1),
            "tests_taken": len(tests),
            "test_history": tests,
            "test_trend": test_trend,
            "subject_mastery": subject_mastery,
            "weakest_subject": weakest_subject,
            "coding": coding_stats,
            "soft_skills": soft_skills
        }
    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch student profile")