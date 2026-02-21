
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Dict, Any
import resume_analyzer
import json

router = APIRouter()

# --- Load ALL databases on startup ---
try:
    # (Optional) Still used for the simple "best role" finder.
    # Make sure skills here are the CANONICAL names from the synonym file.
    ROLES_DATABASE_CSV = resume_analyzer.load_roles_from_csv("dataset.csv")
    if not ROLES_DATABASE_CSV:
        print("Warning: Roles database (dataset.csv) is empty.")
except Exception as e:
    print(f"Failed to load roles database from CSV: {e}")
    ROLES_DATABASE_CSV = {}

try:
    # Used for the detailed breakdown structure
    STRUCTURED_ROLES_DB = resume_analyzer.load_structured_roles_from_json("role_skill_breakdown.json")
    if not STRUCTURED_ROLES_DB:
        print("Warning: Structured roles database (role_skill_breakdown.json) is empty.")
except Exception as e:
    print(f"Failed to load structured roles database: {e}")
    STRUCTURED_ROLES_DB = {}

try:
    # NEW: The master skill list with all aliases
    SKILL_SYNONYM_MAP = resume_analyzer.load_skill_synonyms("skill_synonyms.json")
    if not SKILL_SYNONYM_MAP:
        print("Warning: Skill synonym map (skill_synonyms.json) is empty.")
except Exception as e:
    print(f"Failed to load skill synonyms: {e}")
    SKILL_SYNONYM_MAP = {}


@router.post("/resume/analyze-role")
async def analyze_resume_for_role(
    resume: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Endpoint for Feature 1 (Match to Role):
    Analyzes a resume, finds the best match, AND provides a detailed breakdown.
    """
    if not STRUCTURED_ROLES_DB or not ROLES_DATABASE_CSV or not SKILL_SYNONYM_MAP:
        raise HTTPException(status_code=500, detail="Server error: Skills databases not loaded.")

    try:
        resume_content = await resume.read()
        resume_text = resume_analyzer.extract_text_from_resume(resume.filename, resume_content)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume.")

        # --- This is the new, smarter skill extraction ---
        resume_skills = resume_analyzer.extract_skills_from_text(resume_text, SKILL_SYNONYM_MAP)
        
        # Step 1: Find the best matching role title using the original CSV database
        role_match_simple = resume_analyzer.match_resume_to_roles(resume_skills, ROLES_DATABASE_CSV)
        best_role_name = role_match_simple.get("role", "No Match Found")

        if best_role_name == "No Match Found":
            return {
                "best_match_details": {
                    "role": "No Match Found",
                    "overall_score": 0,
                    "breakdown": []
                },
                "format_analysis": resume_analyzer.analyze_resume_format(resume_text),
                "resume_skills_found": list(resume_skills)
            }

        # Step 2: Get the detailed, categorized breakdown for that best role
        detailed_analysis = resume_analyzer.get_detailed_role_match(
            resume_skills,
            best_role_name,
            STRUCTURED_ROLES_DB
        )

        return {
            "best_match_details": detailed_analysis,
            "format_analysis": resume_analyzer.analyze_resume_format(resume_text),
            "resume_skills_found": list(resume_skills)
        }

    except Exception as e:
        print(f"Error in /analyze-role: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")


@router.post("/resume/analyze-jd")
async def analyze_resume_for_jd(
    job_description: str = Form(...),
    job_role: str = Form(...),
    resume: UploadFile = File(...)
) -> Dict[str, Any]:
    """
    Endpoint for Feature 2 (Match to JD) (MODIFIED):
    Analyzes a resume against a specific job description and provides a detailed breakdown.
    """
    if not STRUCTURED_ROLES_DB or not SKILL_SYNONYM_MAP:
        raise HTTPException(status_code=500, detail="Server error: Skills databases not loaded.")
        
    try:
        resume_content = await resume.read()
        resume_text = resume_analyzer.extract_text_from_resume(resume.filename, resume_content)
        
        if not resume_text:
            raise HTTPException(status_code=400, detail="Could not extract text from resume.")

        # Perform all analyses
        resume_skills = resume_analyzer.extract_skills_from_text(resume_text, SKILL_SYNONYM_MAP)
        format_analysis = resume_analyzer.analyze_resume_format(resume_text)
        
        # --- Call the categorized JD match function ---
        jd_match_details = resume_analyzer.match_resume_to_jd_categorized(
            resume_skills, 
            job_description,
            job_role,
            STRUCTURED_ROLES_DB,
            SKILL_SYNONYM_MAP # Pass the synonym map here
        )
        
        return {
            "jd_match_details": jd_match_details, 
            "format_analysis": format_analysis,
            "resume_skills_found": list(resume_skills)
        }

    except Exception as e:
        print(f"Error in /analyze-jd: {e}")
        raise HTTPException(status_code=500, detail=f"An internal error occurred: {str(e)}")
