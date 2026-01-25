import os
import re
import json
import uuid
import shutil
from typing import List
from fastapi import APIRouter, Body, HTTPException, Depends
from pydantic import BaseModel
import google.generativeai as genai
import docker
from database import get_cursor

router = APIRouter(
    prefix="/api/coding",
    tags=["Coding"],
)

# --- Pydantic Models ---

class LevelProblemRequest(BaseModel):
    difficulty: str
    user_id: int
    count: int = 5

class EvaluationRequest(BaseModel):
    user_id: int
    problem: dict
    code: str
    language: str
    difficulty: str

class RunRequest(BaseModel):
    code: str
    language: str
    input: str

class LevelStatusRequest(BaseModel):
    user_id: int
    difficulty: str

# --- Prompt Engineering Functions ---

def create_batch_problem_prompt(difficulty: str, count: int, solved_titles: List[str] = None) -> str:
    avoid_instruction = ""
    if solved_titles:
        titles_str = ", ".join([f'"{title}"' for title in solved_titles])
        avoid_instruction = f"\\nIMPORTANT: Do NOT generate a problem with any of the following titles: {titles_str}."

    return f"""
    Generate exactly {count} unique software engineering coding interview problems of {difficulty} difficulty.
    Focus on common topics like arrays, strings, trees, graphs, or dynamic programming.{avoid_instruction}

    **CRITICAL JSON RULES:**
    1. Return strictly VALID JSON.
    2. Do NOT use Markdown formatting (no ```json blocks).
    3. ESCAPE all control characters inside strings. For example, use "\\n" for newlines, NOT actual line breaks.
    4. The output must be a single line of JSON or properly structured JSON without unescaped control characters.

    Return the response as a SINGLE, STRICT JSON object with a key "problems" which is a list of {count} problem objects.
    Each problem object must have the following structure:
    {{
        "title": "A concise and descriptive title",
        "description": "A detailed description. Use \\n for line breaks.",
        "input_format": "Description of input format",
        "output_format": "Description of output format",
        "constraints": ["Constraint 1", "Constraint 2"],
        "examples": [{{ "input": "...", "output": "...", "explanation": "..." }}]
    }}
    """

def create_evaluation_prompt(problem: dict, code: str, language: str) -> str:
    problem_str = json.dumps(problem, indent=2)
    return f"""
    You are a strict code linter and logical evaluator. 
    
    **CRITICAL JSON RULES:**
    1. Return strictly VALID JSON.
    2. Do NOT use Markdown formatting.
    3. Escape all newlines in feedback strings (e.g., use "\\n").

    **THE PROBLEM:**
    {problem_str}

    **THE USER'S CODE ({language}):**
    ```
    {code}
    ```

    **EVALUATION STEPS:**
    1. Check Syntax & Executability.
    2. Check I/O Handling.
    3. Check Logical Correctness.

    **RESPONSE FORMAT (Strict JSON):**
    {{
        "is_correct": boolean,
        "feedback_points": [
            "Syntax/Logic error point 1",
            "Feedback point 2"
        ],
        "time_complexity": "O(n)",
        "space_complexity": "O(1)"
    }}
    """

# --- Sandbox Execution ---

def run_in_sandbox(language: str, code: str, stdin: str) -> str:
    temp_dir = f"../temp_code/{uuid.uuid4()}"
    os.makedirs(temp_dir, exist_ok=True)

    file_map = {
        "python": "script.py",
        "java": "MyClass.java",
        "cpp": "script.cpp"
    }
    command_map = {
        "python": "python script.py",
        "java": "javac MyClass.java && java MyClass",
        "cpp": "g++ script.cpp -o script && ./script"
    }
    
    file_name = file_map.get(language, "script.py")
    command = command_map.get(language, "python script.py")
    
    if language == 'java':
        if 'public class' in code and 'public class MyClass' not in code:
            code = re.sub(r'public class \w+', 'public class MyClass', code, 1)
        elif 'public class' not in code:
            code = f'public class MyClass {{ public static void main(String[] args) {{ {code} }} }}'

    code_file_path = os.path.join(temp_dir, file_name)
    input_file_path = os.path.join(temp_dir, "input.txt")

    try:
        # 1. Initialize Docker Client (Robust Method for Windows)
        client = None
        try:
            client = docker.from_env()
            client.ping()
        except Exception:
            try:
                # Force Windows named pipe connection if default fails
                client = docker.DockerClient(base_url='npipe:////./pipe/docker_engine')
                client.ping()
            except Exception as e:
                return f"System Error: Docker Desktop is not running. Please start it. (Error: {str(e)})"

        # 2. Prepare Files
        with open(code_file_path, "w", encoding='utf-8') as f:
            f.write(code)
        with open(input_file_path, "w", encoding='utf-8') as f:
            f.write(stdin)

        image_name = f"{language}-runner"
        mount_mode = 'rw' if language in ['java', 'cpp'] else 'ro'
        
        # 3. Run Container
        container = client.containers.run(
            image=image_name,
            command=f"sh -c '{command} < input.txt'",
            volumes={os.path.abspath(temp_dir): {'bind': '/app', 'mode': mount_mode}},
            working_dir="/app",
            user="coder",
            network_disabled=True,
            mem_limit="256m",
            cpuset_cpus="0",
            security_opt=["no-new-privileges"],
            cap_drop=["ALL"],
            remove=True,
            detach=False,
            stop_signal='SIGKILL'
        )
        output = container.decode('utf-8')

    except docker.errors.ContainerError as e:
        output = e.stderr.decode('utf-8')
    except docker.errors.ImageNotFound:
        output = f"Execution environment '{image_name}' not found. Run 'docker build -t {image_name} ...' in backend folder."
    except Exception as e:
        output = f"An unexpected execution error occurred: {str(e)}"
    finally:
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        
    return output

# --- Helper: JSON Cleaner ---
def clean_and_parse_json(text: str):
    """
    Cleans AI response text to ensure valid JSON parsing.
    Removes Markdown code blocks and handles common JSON errors.
    """
    text = re.sub(r'```json\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'```', '', text)
    text = text.strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON Parse Error: {e}")
        try:
            return json.loads(text, strict=False)
        except:
            raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")

# --- API Endpoints ---

@router.post("/run-code")
async def run_user_code(req: RunRequest):
    try:
        output = run_in_sandbox(req.language, req.code, req.input)
        return {"output": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-level-problems")
async def generate_level_problems(req: LevelProblemRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        cursor.execute(
            "SELECT DISTINCT problem_title FROM coding_attempts WHERE user_id = %s AND difficulty = %s AND is_correct = TRUE",
            (req.user_id, req.difficulty)
        )
        solved_problems = cursor.fetchall()
        solved_titles = [item['problem_title'] for item in solved_problems]

        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = create_batch_problem_prompt(req.difficulty, req.count, solved_titles)
        response = await model.generate_content_async(prompt)
        
        data = clean_and_parse_json(response.text)
        
        problems_list = data.get("problems")

        if not problems_list or not isinstance(problems_list, list) or len(problems_list) < req.count:
             if isinstance(data, list):
                 problems_list = data
             else:
                 raise HTTPException(status_code=500, detail=f"AI generated invalid structure.")

        return {"problems": problems_list}
    except Exception as e:
        print(f"Error generating level problems: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while generating problems: {str(e)}")


@router.post("/evaluate-code")
async def evaluate_user_code(req: EvaluationRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = create_evaluation_prompt(req.problem, req.code, req.language)
        response = await model.generate_content_async(prompt)
        
        evaluation_data = clean_and_parse_json(response.text)

        if evaluation_data.get("is_correct"):
            cursor.execute(
                """
                INSERT INTO coding_attempts (user_id, problem_title, difficulty, is_correct)
                VALUES (%s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE is_correct = VALUES(is_correct);
                """,
                (req.user_id, req.problem.get("title"), req.difficulty, True)
            )
            db.commit()

        return evaluation_data
    except Exception as e:
        print(f"Error evaluating code: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during evaluation: {str(e)}")

@router.post("/level-status")
async def get_level_status(req: LevelStatusRequest, db_cursor: tuple = Depends(get_cursor)):
    cursor, db = db_cursor
    try:
        cursor.execute(
            "SELECT COUNT(DISTINCT problem_title) as solved_count FROM coding_attempts WHERE user_id = %s AND difficulty = %s AND is_correct = TRUE",
            (req.user_id, req.difficulty)
        )
        result = cursor.fetchone()
        return {"solved_count": result['solved_count'] if result else 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))