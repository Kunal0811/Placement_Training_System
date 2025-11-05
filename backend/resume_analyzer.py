import io
import csv
import re
import pdfplumber
import docx
import spacy
from typing import List, Dict, Set

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

# --- 1. Data Loading ---

def load_roles_from_csv(csv_path: str = "dataset.csv") -> Dict[str, Set[str]]:
    """Loads the dataset.csv into a dictionary of {role: {skills}}."""
    roles_db = {}
    try:
        with open(csv_path, mode='r', encoding='utf-8') as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            for row in reader:
                if len(row) >= 2:
                    role = row[0].strip()
                    skills = set(skill.strip().lower() for skill in row[1].split(','))
                    roles_db[role] = skills
    except FileNotFoundError:
        print(f"Error: {csv_path} not found. Make sure it's in the backend directory.")
        return {}
    return roles_db

def get_all_skills_flat(roles_db: Dict[str, Set[str]]) -> Set[str]:
    """Gets a single flat set of all unique skills from the roles_db."""
    all_skills = set()
    for skills in roles_db.values():
        all_skills.update(skills)
    return all_skills

# --- 2. Resume Parsing ---

def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    """Extracts text from a PDF file stream."""
    text = ""
    with pdfplumber.open(file_stream) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.lower()

def extract_text_from_docx(file_stream: io.BytesIO) -> str:
    """Extracts text from a DOCX file stream."""
    doc = docx.Document(file_stream)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text.lower()

def extract_text_from_resume(file_name: str, file_content: bytes) -> str:
    """Extracts text from PDF or DOCX."""
    file_stream = io.BytesIO(file_content)
    if file_name.endswith(".pdf"):
        return extract_text_from_pdf(file_stream)
    elif file_name.endswith(".docx"):
        return extract_text_from_docx(file_stream)
    else:
        # Fallback for .txt or other simple formats
        try:
            return file_content.decode('utf-8').lower()
        except UnicodeDecodeError:
            return ""

# --- 3. Analysis Logic ---

def extract_skills_from_text(text: str, all_skills_list: Set[str]) -> Set[str]:
    """Finds which skills from the master list are in the text."""
    found_skills = set()
    # Use spaCy to process text for better matching (e.g., handles punctuation)
    doc = nlp(text)
    # Create a lemmatized version of the text for broader matching
    lemmatized_text = " ".join([token.lemma_ for token in doc])

    for skill in all_skills_list:
        # We use regex with word boundaries to match whole words/phrases
        # \b ensures "java" doesn't match "javascript"
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text) or re.search(pattern, lemmatized_text):
            found_skills.add(skill)
    return found_skills

def analyze_resume_format(text: str) -> Dict[str, bool]:
    """Checks for the presence of common resume sections."""
    sections = {
        "projects": bool(re.search(r"project(s)?", text, re.I)),
        "skills": bool(re.search(r"skill(s)?|technologies", text, re.I)),
        "certifications": bool(re.search(r"certification(s)?|certificate(s)?", text, re.I)),
        "experience": bool(re.search(r"experience|work history", text, re.I)),
        "achievements": bool(re.search(r"achievement(s)?|award(s)?", text, re.I)),
        "education": bool(re.search(r"education|qualification(s)?", text, re.I)),
    }
    return sections

# --- 4. Scoring & Matching ---

def match_resume_to_roles(resume_skills: Set[str], roles_db: Dict[str, Set[str]]):
    """
    Feature 1: Finds the best matching role from the dataset.
    """
    best_match = {
        "role": "No Match Found",
        "score": 0,
        "matching_skills": [],
        "missing_skills": [],
    }
    
    for role, required_skills in roles_db.items():
        if not required_skills:
            continue
            
        matching_skills = resume_skills.intersection(required_skills)
        score = (len(matching_skills) / len(required_skills)) * 100
        
        if score > best_match["score"]:
            best_match = {
                "role": role,
                "score": round(score, 2),
                "matching_skills": list(matching_skills),
                "missing_skills": list(required_skills - resume_skills),
            }
            
    return best_match

def match_resume_to_jd(resume_skills: Set[str], jd_text: str, all_skills_list: Set[str]):
    """
    Feature 2: Scores a resume against a specific job description.
    """
    jd_text_lower = jd_text.lower()
    jd_skills = extract_skills_from_text(jd_text_lower, all_skills_list)
    
    if not jd_skills:
        return {
            "score": 0,
            "matching_skills": [],
            "missing_skills": [],
            "jd_skills_found": []
        }
        
    matching_skills = resume_skills.intersection(jd_skills)
    score = (len(matching_skills) / len(jd_skills)) * 100
    
    return {
        "score": round(score, 2),
        "matching_skills": list(matching_skills),
        "missing_skills": list(jd_skills - resume_skills),
        "jd_skills_found": list(jd_skills)
    }