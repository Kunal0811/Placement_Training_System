# backend/resume_routes.py
import os
import re
import json
import io
import asyncio
from fastapi import APIRouter, Body, HTTPException, Depends, UploadFile, File, Form
import pdfplumber
from docx import Document
import google.generativeai as genai
import nltk

# (Ensure NLTK 'punkt' is downloaded, which your main.py should handle)

router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"],
)

# --- (Text Extraction & Parsing functions remain the same) ---

def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    text = ""
    try:
        with pdfplumber.open(file_stream) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_text_from_docx(file_stream: io.BytesIO) -> str:
    text = ""
    try:
        doc = Document(file_stream)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX: {e}")
    return text

def parse_resume_to_sections(resume_text: str) -> dict:
    sections = {}
    # Define common resume headings.
    section_keywords = {
        'summary': r'(summary|objective|profile|about me)',
        'experience': r'(experience|work experience|employment history)',
        'education': r'(education|academic background)',
        'skills': r'(skills|technical skills|technologies)',
        'projects': r'(projects|personal projects)',
        'achievements': r'(achievements|awards|honors)',
        'certifications': r'(certifications|licenses & certifications)'
    }
    
    lines = [line for line in resume_text.split('\n') if line.strip()]
    current_section = 'header'
    sections[current_section] = []

    for line in lines:
        found_section = False
        for section_name, pattern in section_keywords.items():
            if re.match(pattern, line, re.IGNORECASE) and len(line.split()) <= 4:
                current_section = section_name
                sections[current_section] = []
                found_section = True
                break
        
        if not found_section:
            if current_section in sections:
                sections[current_section].append(line)
            else:
                sections[current_section] = [line]

    # Join the lines back into a single text block for each section
    for section_name, content_lines in sections.items():
        sections[section_name] = "\n".join(content_lines)

    return sections

# --- NEW: AI "Mega-Prompt" Function ---

def create_expert_analyzer_prompt(sections: dict, job_description: str, job_role: str) -> str:
    
    # We build the prompt string by string, adding the sections we found
    resume_content = ""
    if sections.get('summary'):
        resume_content += f"\n[RESUME SUMMARY]\n{sections['summary']}\n"
    if sections.get('experience'):
        resume_content += f"\n[RESUME EXPERIENCE]\n{sections['experience']}\n"
    if sections.get('skills'):
        resume_content += f"\n[RESUME SKILLS]\n{sections['skills']}\n"
    if sections.get('projects'):
        resume_content += f"\n[RESUME PROJECTS]\n{sections['projects']}\n"
    if sections.get('education'):
        resume_content += f"\n[RESUME EDUCATION]\n{sections['education']}\n"
    if sections.get('certifications'):
        resume_content += f"\n[RESUME CERTIFICATIONS]\n{sections['certifications']}\n"
    
    # This is the "prompt engineering" part. We instruct the AI to follow
    # the exact structure of your example.
    return f"""
    You are an expert HR recruiter and technical resume analyst for the role of '{job_role}'.
    Analyze the provided RESUME SECTIONS against the JOB DESCRIPTION.
    Your analysis must be critical, insightful, and constructive.

    Return your analysis as a single, strict JSON object (no markdown).
    Do NOT include any text outside the JSON object.

    The JSON object MUST have this exact structure:
    {{
      "overall_score": <int, 0-100>,
      "overall_summary": "<string, a 2-3 sentence expert summary of the candidate's fit>",
      "skill_match_breakdown": [
        {{
          "skill_area": "<string, e.g., 'Frontend Development'>",
          "job_requirement": "<string, e.g., 'HTML, CSS, React'>",
          "resume_mention": "<string, e.g., '✅ HTML, CSS, React'>",
          "match_rating": "<int, 1-5 stars>"
        }}
      ],
      "project_relevance": {{
        "summary": "<string, 1-2 sentence summary of project relevance>",
        "tips": ["<string, specific tip 1>", "<string, tip 2>"]
      }},
      "education_analysis": {{
        "summary": "<string, 1-2 sentence summary of education fit>",
        "tips": ["<string, improvement tip 1>"]
      }},
      "recommended_improvements": [
        "<string, overall improvement 1>",
        "<string, overall improvement 2>",
        "<string, overall improvement 3>"
      ]
    }}

    ---
    [JOB DESCRIPTION]
    {job_description}
    ---
    {resume_content}
    ---
    """

# --- NEW: Main API Endpoint (Overwritten) ---

@router.post("/analyze")
async def analyze_resume(
    job_description: str = Form(...),
    job_role: str = Form(...),
    resume_file: UploadFile = File(...)
):
    
    # 1. Extract Text
    resume_text = ""
    try:
        file_content = await resume_file.read()
        file_stream = io.BytesIO(file_content)
        
        if resume_file.filename.endswith(".pdf"):
            resume_text = extract_text_from_pdf(file_stream)
        elif resume_file.filename.endswith(".docx"):
            resume_text = extract_text_from_docx(file_stream)
        else:
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload a .pdf or .docx file.")
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from the uploaded resume.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

    # 2. Parse Resume into Sections
    sections = parse_resume_to_sections(resume_text)
    if not sections.get('skills') and not sections.get('experience'):
        # If the parser fails, just use the whole text as a "summary"
        sections['summary'] = resume_text

    # 3. Create the single, expert prompt
    prompt = create_expert_analyzer_prompt(sections, job_description, job_role)

    # 4. Call the AI model
    # 4. Call the AI model
    try:
        # --- FIX: Add GenerationConfig ---
        config = genai.GenerationConfig(
            temperature=0.0,  # This makes the output deterministic
            response_mime_type="application/json" # This forces JSON output
        )
        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            generation_config=config
        )
        # --- END OF FIX ---

        response = await model.generate_content_async(prompt)

        # --- FIX: Simplify JSON parsing ---
        try:
            # No more regex needed. The response.text *is* the JSON string.
            json_response = json.loads(response.text)
        except json.JSONDecodeError:
            print("AI_RESPONSE_ERROR (Invalid JSON):", response.text)
            raise HTTPException(status_code=500, detail="AI analysis failed to return valid JSON.")

        return json_response
        # --- END OF FIX ---

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during AI analysis: {str(e)}")