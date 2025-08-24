import os
import json
import re
from typing import List, Dict
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

SYSTEM = """You are an MCQ generator for aptitude tests.
Return STRICT JSON only, without markdown or text outside JSON.
Each item must have:
- question_text (string)
- options (array of 4 distinct strings)
- correct_answer (must be one of the options)
- explanation (1–3 concise lines)"""

USER_TEMPLATE = """Generate {count} multiple-choice questions for Aptitude.
Topic: {topic}
Difficulty: {difficulty}

Constraints:
- Output must be valid JSON in this shape:
{{
  "questions": [
    {{
      "question_text": "...",
      "options": ["...", "...", "...", "..."],
      "correct_answer": "...",
      "explanation": "..."
    }}
  ]
}}
- Do NOT add markdown, headers, or explanations outside JSON.
"""

def _safe_json_extract(text: str) -> List[Dict]:
    try:
        data = json.loads(text)
    except Exception:
        # try to extract JSON part only
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            try:
                data = json.loads(match.group(0))
            except Exception:
                return []
        else:
            return []

    qs = data.get("questions", [])
    cleaned = []
    for q in qs:
        if (
            isinstance(q.get("question_text"), str)
            and isinstance(q.get("options"), list)
            and len(q["options"]) == 4
            and isinstance(q.get("correct_answer"), str)
            and q["correct_answer"] in q["options"]
        ):
            cleaned.append({
                "question_text": q["question_text"].strip(),
                "options": [str(o).strip() for o in q["options"]],
                "correct_answer": q["correct_answer"].strip(),
                "explanation": str(q.get("explanation", "")).strip()
            })
    return cleaned

def generate_mcqs_via_ai(topic: str, difficulty: str, count: int = 20) -> List[Dict]:
    user_prompt = USER_TEMPLATE.format(topic=topic, difficulty=difficulty, count=count)

    model = genai.GenerativeModel(MODEL)
    resp = model.generate_content([SYSTEM, user_prompt])

    text = resp.text.strip()
    items = _safe_json_extract(text)
    return items[:count]
