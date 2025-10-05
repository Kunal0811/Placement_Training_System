import os
import re
import json
import uuid
import shutil
from fastapi import APIRouter, Body, HTTPException, Depends
from pydantic import BaseModel
import google.generativeai as genai
import docker

router = APIRouter(
    prefix="/api/coding",
    tags=["Coding"],
)

class ProblemRequest(BaseModel):
    difficulty: str

class EvaluationRequest(BaseModel):
    problem: dict
    code: str
    language: str

class RunRequest(BaseModel):
    code: str
    language: str
    input: str

class LevelStatusRequest(BaseModel):
    user_id: int
    difficulty: str

def create_problem_prompt(difficulty: str) -> str:
    return f"""
    Generate a standard software engineering coding interview problem of {difficulty} difficulty.
    The problem should be self-contained and suitable for a platform like LeetCode or HackerRank.
    Focus on common topics like arrays, strings, trees, graphs, or dynamic programming.

    Return the response as a SINGLE, STRICT JSON object (no markdown, no text outside the JSON) with the following structure:
    {{
        "title": "A concise and descriptive title for the problem",
        "description": "A detailed, paragraph-style description of the problem. Explain the task clearly.",
        "input_format": "A clear description of the input format. Specify if input is on single or multiple lines.",
        "output_format": "A clear description of the expected output format.",
        "constraints": [
            "A list of constraints as an array of strings."
        ],
        "examples": [
            {{
                "input": "An example input string that matches the input format. Use '\\n' for newlines.",
                "output": "The corresponding output string.",
                "explanation": "A brief explanation of how the output is derived from the input."
            }}
        ]
    }}
    """

def create_evaluation_prompt(problem: dict, code: str, language: str) -> str:
    problem_str = json.dumps(problem, indent=2)
    return f"""
    You are a strict code linter and logical evaluator. Your primary goal is to act like a compiler or interpreter to first find syntax errors, and only then evaluate the logic.

    **THE PROBLEM (Pay close attention to the specified Input/Output format):**
    ```json
    {problem_str}
    ```

    **THE USER'S CODE ({language}):**
    ```
    {code}
    ```

    **EVALUATION STEPS (MUST be followed in this order):**

    1.  **Syntax & Executability Check (CRITICAL FIRST STEP):**
        -   First, act as a strict compiler. Is the code syntactically valid? (Check Python indentation, Java/C++ syntax, etc.).
        -   Second, is the main logic of the code actually executable? For example, if the core logic is inside a function, is that function ever called in the global scope? A script that only defines functions but never calls them is incorrect because it does nothing.
        -   If there is a fatal syntax or executability error, set `is_correct` to `false` and make this the primary feedback point. Do NOT evaluate the logic further.

    2.  **I/O Handling Check (If Step 1 passes):**
        -   Does the user's code correctly read the *exact* input format described in the problem? If the input is two separate lines, does the code read two lines? If it fails this, the solution is wrong.

    3.  **Logical Correctness (Only if Steps 1 & 2 pass):**
        -   Analyze the core algorithm. Does it solve the problem accurately for all cases?
        -   Does it correctly handle the examples and constraints provided?
        -   Identify any logical flaws or missed edge cases.

    **RESPONSE FORMAT (Strict JSON is required):**
    {{
        "is_correct": boolean,
        "feedback_points": [
            "If a syntax/executability error is found, this MUST be the first point (e.g., 'Error: The main function is defined but never called.').",
            "If the I/O handling is wrong, this MUST be the first point (e.g., 'Error: The code does not handle the multi-line input format correctly.').",
            "If syntax/IO is OK, provide a point on the overall algorithmic approach.",
            "If syntax/IO is OK, provide a point on implementation details and logic flaws."
        ],
        "time_complexity": "The estimated time complexity (e.g., 'O(n)'). Set to 'N/A' if the code is incorrect.",
        "space_complexity": "The estimated space complexity (e.g., 'O(1)'). Set to 'N/A' if the code is incorrect."
    }}
    """

def run_in_sandbox(language: str, code: str, stdin: str) -> str:
    # Create the temp directory one level *above* the current backend directory
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
        # Ensure the public class name matches the file name 'MyClass'
        if 'public class' in code and 'public class MyClass' not in code:
             # A simple heuristic to replace the user's class name
            code = re.sub(r'public class \w+', 'public class MyClass', code, 1)
        elif 'public class' not in code:
            code = f'public class MyClass {{ public static void main(String[] args) {{ {code} }} }}'

    code_file_path = os.path.join(temp_dir, file_name)
    input_file_path = os.path.join(temp_dir, "input.txt")

    with open(code_file_path, "w") as f:
        f.write(code)
    with open(input_file_path, "w") as f:
        f.write(stdin)

    client = docker.from_env()
    image_name = f"{language}-runner"
    
    # Set volume mode to read-write for compiled languages, otherwise read-only
    mount_mode = 'rw' if language in ['java', 'cpp'] else 'ro'
    
    output = ""
    try:
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
        output = f"Execution environment not found. Please build the '{image_name}' Docker image."
    except Exception as e:
        output = f"An unexpected execution error occurred: {str(e)}"
    finally:
        shutil.rmtree(temp_dir)
        
    return output

@router.post("/run-code")
async def run_user_code(req: RunRequest):
    try:
        output = run_in_sandbox(req.language, req.code, req.input)
        return {"output": output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-problem")
async def generate_coding_problem(req: ProblemRequest):
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = create_problem_prompt(req.difficulty)
        response = await model.generate_content_async(prompt)
        
        text = response.text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if not match:
            raise HTTPException(status_code=500, detail="Failed to parse valid JSON from AI response.")
        
        json_str = match.group(0)
        problem_data = json.loads(json_str)
        
        return problem_data
    except Exception as e:
        print(f"Error generating coding problem: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the problem: {str(e)}")


@router.post("/evaluate-code")
async def evaluate_user_code(req: EvaluationRequest, db_cursor: tuple = Depends()): # Placeholder for now
    cursor, db = db_cursor
    
    # First, get the AI evaluation
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = create_evaluation_prompt(req.problem, req.code, req.language)
        response = await model.generate_content_async(prompt)
        text = response.text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if not match:
            raise HTTPException(status_code=500, detail="Failed to parse evaluation from AI response.")
        
        evaluation_data = json.loads(match.group(0))

        # If the solution is correct, save it to the database
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
async def get_level_status(req: LevelStatusRequest, db_cursor: tuple = Depends()): # Placeholder for now
    cursor, db = db_cursor
    try:
        # Count the number of *unique* correct problems for the given difficulty
        cursor.execute(
            """
            SELECT COUNT(DISTINCT problem_title) as solved_count
            FROM coding_attempts
            WHERE user_id = %s AND difficulty = %s AND is_correct = TRUE
            """,
            (req.user_id, req.difficulty)
        )
        result = cursor.fetchone()
        solved_count = result['solved_count'] if result else 0
        
        return {"solved_count": solved_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
