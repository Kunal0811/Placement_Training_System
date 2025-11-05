from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, Any
import resume_analyzer

router = APIRouter()

# Load the skills database when the server starts
try:
    ROLES_DATABASE = resume_analyzer.load_roles_from_csv("dataset.csv")
    ALL_SKILLS_LIST = resume_analyzer.get_all_skills_flat(ROLES_DATABASE)
    if not ROLES_DATABASE:
        print("Warning: Roles database is empty. Check dataset.csv.")
except Exception as e:
    print(f"Failed to load roles database: {e}")
    ROLES_DATABASE = {}
    ALL_SKILLS_LIST = set()

@router.post("/resume/analyze-role")
async def analyze_resume_for_role(
    resume: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Endpoint for Feature 1:
    Analyzes a resume and finds the best matching role from dataset.csv.
    """
    if not ROLES_DATABASE:
        raise HTTPException(status_code=500, detail="Server error: Roles database not loaded.")

    try:
        resume_content = await resume.read()
        resume_text = resume_analyzer.extract_text_from_resume(resume.filename, resume_content)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume.")

        # Perform all analyses
        resume_skills = resume_analyzer.extract_skills_from_text(resume_text, ALL_SKILLS_LIST)
        format_analysis = resume_analyzer.analyze_resume_format(resume_text)
        role_match = resume_analyzer.match_resume_to_roles(resume_skills, ROLES_DATABASE)

        return {
            "best_match": role_match,
            "format_analysis": format_analysis,
            "resume_skills_found": list(resume_skills)
        }

    except Exception as e:
        print(f"Error in /analyze-role: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")

@router.post("/resume/analyze-jd")
async def analyze_resume_for_jd(
    job_description: str = Form(...),
    resume: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Endpoint for Feature 2:
    Analyzes a resume against a specific job description.
    """
    try:
        resume_content = await resume.read()
        resume_text = resume_analyzer.extract_text_from_resume(resume.filename, resume_content)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume.")

        # Perform all analyses
        resume_skills = resume_analyzer.extract_skills_from_text(resume_text, ALL_SKILLS_LIST)
        format_analysis = resume_analyzer.analyze_resume_format(resume_text)
        jd_match = resume_analyzer.match_resume_to_jd(resume_skills, job_description, ALL_SKILLS_LIST)
        
        return {
            "jd_match": jd_match,
            "format_analysis": format_analysis,
            "resume_skills_found": list(resume_skills)
        }

    except Exception as e:
        print(f"Error in /analyze-jd: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")