import io
import csv
import re
import pdfplumber
import docx
import spacy
from typing import List, Dict, Set
import json

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

# --- 1. Data Loading ---

def load_roles_from_csv(csv_path: str = "dataset.csv") -> Dict[str, Set[str]]:
    """Loads the dataset.csv for the simple "best role" match."""
    roles_db = {}
    try:
        with open(csv_path, mode='r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 2:
                    role = row[0].strip()
                    # Skills from CSV *must* be lowercase canonical names
                    skills = set(skill.strip().lower() for skill in row[1].split(','))
                    roles_db[role] = skills
    except FileNotFoundError:
        print(f"Error: {csv_path} not found. Make sure it's in the backend directory.")
        return {}
    return roles_db

def load_structured_roles_from_json(json_path: str = "role_skill_breakdown.json") -> Dict:
    """Loads the new structured JSON knowledge base."""
    try:
        with open(json_path, mode='r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: {json_path} not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Could not decode {json_path}.")
        return {}

def load_skill_synonyms(json_path: str = "skill_synonyms.json") -> Dict[str, List[str]]:
    """Loads the skill synonym mapping."""
    try:
        with open(json_path, mode='r', encoding='utf-8') as file:
            data = json.load(file)
            synonym_map = {}
            for canonical_skill, aliases in data.items():
                # Key (canonical skill) is now lowercase, values (aliases) are lowercase
                synonym_map[canonical_skill.lower()] = [alias.lower() for alias in aliases]
            return synonym_map
    except FileNotFoundError:
        print(f"Error: {json_path} not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Could not decode {json_path}.")
        return {}


# --- 2. Resume Parsing ---

def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    text = ""
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(file_stream: io.BytesIO) -> str:
    doc = docx.Document(file_stream)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_text_from_resume(file_name: str, file_content: bytes) -> str:
    file_stream = io.BytesIO(file_content)
    if file_name.endswith(".pdf"):
        return extract_text_from_pdf(file_stream)
    elif file_name.endswith(".docx"):
        return extract_text_from_docx(file_stream)
    else:
        try:
            return file_content.decode('utf-8')
        except UnicodeDecodeError:
            return ""

# --- 3. Analysis Logic ---

def extract_skills_from_text(text: str, skill_synonym_map: Dict[str, List[str]]) -> Set[str]:
    """
    Finds skills using the synonym map.
    Returns a set of *lowercase canonical skill names*.
    """
    found_skills = set()
    text_lower = text.lower()
    doc = nlp(text_lower)
    lemmatized_text = " ".join([token.lemma_ for token in doc])
    
    for canonical_skill_lower, aliases in skill_synonym_map.items():
        pattern = r"\b(" + "|".join(re.escape(alias) for alias in aliases) + r")\b"
        
        if re.search(pattern, text_lower) or re.search(pattern, lemmatized_text):
            found_skills.add(canonical_skill_lower) # Add the lowercase canonical skill
            
    return found_skills

def analyze_resume_format(text: str) -> Dict[str, bool]:
    """
    Checks for the presence of common resume sections as headings.
    This is the more robust version to fix the "Experience" bug.
    """
    
    def find_heading(keyword_pattern: str, text: str) -> bool:
        """
        Checks line by line for a heading.
        A heading is a short line that is (or starts with) the keyword.
        """
        # This regex matches a line that *is* the heading (with optional colon/space)
        # e.g., "Experience", "EXPERIENCE:", "  Projects : "
        heading_regex = re.compile(r"^\s*(" + keyword_pattern + r")\s*:?\s*$", re.IGNORECASE)
        
        for line in text.splitlines():
            line_stripped = line.strip()
            
            # Skip empty lines
            if not line_stripped:
                continue
            
            # We only check short lines, as headings are not paragraphs
            # A line like "I have 3 years of experience" will be > 50 chars and ignored
            if len(line_stripped) < 50:
                if heading_regex.match(line_stripped):
                    return True
        return False

    sections = {
        "projects": find_heading(r"project(s)?|personal projects", text),
        "skills": find_heading(r"skill(s)?|technologies|technical skills", text),
        "certifications": find_heading(r"certification(s)?|certificate(s)?", text),
        "experience": find_heading(r"experience|work history|professional experience|internship(s)?", text),
        "achievements": find_heading(r"achievement(s)?|award(s)?|honors", text),
        "education": find_heading(r"education|qualification(s)?|academic background", text),
    }
    return sections


# --- 4. Scoring & Matching ---

def match_resume_to_roles(resume_skills: Set[str], roles_db: Dict[str, Set[str]]):
    """Finds the best matching role from the CSV dataset."""
    best_match = { "role": "No Match Found", "score": 0, "matching_skills": [], "missing_skills": [] }
    
    for role, required_skills_csv in roles_db.items():
        if not required_skills_csv: continue
        
        # Both sets are now lowercase canonical skills
        matching_skills = resume_skills.intersection(required_skills_csv)
        score = 0
        if required_skills_csv:
            score = (len(matching_skills) / len(required_skills_csv)) * 100
        
        if score > best_match["score"]:
            best_match = {
                "role": role,
                "score": round(score, 2), 
                "matching_skills": list(matching_skills),
                "missing_skills": list(required_skills_csv - resume_skills),
            }
            
    return best_match

def get_detailed_role_match(resume_skills: Set[str], role: str, structured_db: Dict):
    """(For "Match to Role") Analyzes a resume against a specific role from the JSON DB."""
    if role not in structured_db:
        return {"error": f"Role '{role}' not found in structured database."}

    role_categories = structured_db[role]
    analysis_breakdown = []
    total_required_skills = 0
    total_matched_skills = 0

    for category in role_categories:
        skill_area = category.get("skill_area")
        job_requirement_skills = set(s.lower() for s in category.get("job_requirement_skills", []))
        
        if not job_requirement_skills: continue

        total_required_skills += len(job_requirement_skills)
        
        # Both sets are lowercase
        matched_in_category = resume_skills.intersection(job_requirement_skills)
        missing_in_category = job_requirement_skills.difference(resume_skills)
        
        total_matched_skills += len(matched_in_category)

        resume_skills_text = ", ".join(s.capitalize() for s in matched_in_category)
        if not resume_skills_text:
            resume_skills_text = "Not explicitly mentioned"

        match_score = 0
        if len(job_requirement_skills) > 0:
            match_score = (len(matched_in_category) / len(job_requirement_skills))
        
        match_rating = round(match_score * 5, 1)

        analysis_breakdown.append({
            "skill_area": skill_area,
            "job_requirement": ", ".join(s.capitalize() for s in job_requirement_skills),
            "your_resume": resume_skills_text,
            "match_rating": match_rating,
            "missing_skills": list(missing_in_category)
        })

    overall_score = 0
    if total_required_skills > 0:
        overall_score = round((total_matched_skills / total_required_skills) * 100)

    return {
        "role": role,
        "overall_score": overall_score,
        "breakdown": analysis_breakdown
    }

def match_resume_to_jd_categorized(resume_skills: Set[str], jd_text: str, role_name: str, structured_db: Dict, skill_synonym_map: Dict[str, List[str]]):
    """(For "Match to JD") Analyzes resume against JD text using the specified role as a lens."""
    
    # jd_skills is now a set of lowercase canonical skills
    jd_skills = extract_skills_from_text(jd_text, skill_synonym_map)
    
    if not jd_skills:
        return {"overall_score": 0, "breakdown": []}

    role_categories = structured_db.get(role_name)
    
    if not role_categories:
        return {"overall_score": 0, "breakdown": [], "error": f"Role '{role_name}' not found."}
    
    analysis_breakdown = []
    total_required_skills_in_jd = 0
    total_matched_skills = 0

    for category in role_categories:
        skill_area = category.get("skill_area")
        all_canonical_skills_in_category = set(s.lower() for s in category.get("job_requirement_skills", []))

        # Both sets are lowercase
        jd_skills_in_this_category = jd_skills.intersection(all_canonical_skills_in_category)
        
        if jd_skills_in_this_category:
            job_requirement_text = ", ".join(s.capitalize() for s in jd_skills_in_this_category)
            
            # Both sets are lowercase
            resume_skills_in_this_category = resume_skills.intersection(jd_skills_in_this_category)
            resume_skills_text = ", ".join(s.capitalize() for s in resume_skills_in_this_category)
            if not resume_skills_text:
                resume_skills_text = "Not explicitly mentioned"
                
            match_rating = round((len(resume_skills_in_this_category) / len(jd_skills_in_this_category)) * 5, 1)

            analysis_breakdown.append({
                "skill_area": skill_area,
                "job_requirement": job_requirement_text,
                "your_resume": resume_skills_text,
                "match_rating": match_rating,
                "missing_skills": list(jd_skills_in_this_category - resume_skills_in_this_category)
            })
            
            total_required_skills_in_jd += len(jd_skills_in_this_category)
            total_matched_skills += len(resume_skills_in_this_category)

    overall_score = 0
    if total_required_skills_in_jd > 0:
        overall_score = round((total_matched_skills / total_required_skills_in_jd) * 100)

    return {
        "role": f"JD Match ({role_name})",
        "overall_score": overall_score,
        "breakdown": analysis_breakdown
    }