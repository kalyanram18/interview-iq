import re
from io import BytesIO

from pypdf import PdfReader


SKILL_BANK = {
    "python", "java", "javascript", "typescript", "react", "node", "fastapi", "django",
    "sql", "postgresql", "mongodb", "docker", "kubernetes", "aws", "git", "linux",
    "machine learning", "deep learning", "nlp", "pandas", "numpy", "tensorflow",
    "pytorch", "html", "css", "tailwind", "rest api", "graphql", "data structures",
    "algorithms", "dbms", "operating systems", "computer networks", "oop",
}

ROLE_KEYWORDS = {
    "SDE": {"data structures", "algorithms", "oop", "dbms", "operating systems", "computer networks", "git"},
    "Full Stack": {"react", "node", "fastapi", "sql", "rest api", "typescript", "docker"},
    "AI/ML": {"python", "machine learning", "deep learning", "nlp", "pandas", "numpy"},
    "Data Analyst": {"sql", "python", "pandas", "statistics", "excel", "power bi"},
}


async def extract_pdf_text(file_bytes: bytes) -> str:
    reader = PdfReader(BytesIO(file_bytes))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()


def analyze_resume_text(text: str) -> dict:
    normalized = re.sub(r"\s+", " ", text.lower())
    skills = sorted(skill for skill in SKILL_BANK if skill in normalized)
    projects = _extract_lines(text, ["project", "built", "developed"], limit=5)
    experience = _extract_lines(text, ["intern", "experience", "worked"], limit=4)
    certifications = _extract_lines(text, ["certification", "certificate", "certified"], limit=4)
    role_scores = {
        role: len(required.intersection(skills)) / max(len(required), 1)
        for role, required in ROLE_KEYWORDS.items()
    }
    suitable_roles = [role for role, score in sorted(role_scores.items(), key=lambda item: item[1], reverse=True)[:3]]
    best_role = suitable_roles[0] if suitable_roles else "SDE"
    missing = sorted(ROLE_KEYWORDS.get(best_role, set()).difference(skills))
    ats_score = min(95, 35 + len(skills) * 4 + len(projects) * 5 + len(experience) * 6 + len(certifications) * 3)
    domains = _domains_from_skills(skills)

    return {
        "skills": skills,
        "technologies": [skill for skill in skills if skill not in {"data structures", "algorithms", "oop"}],
        "projects": projects or ["Add measurable project descriptions with tech stack, impact, and links."],
        "experience": experience,
        "certifications": certifications,
        "dominant_domains": domains,
        "suitable_roles": suitable_roles,
        "missing_keywords": missing[:8],
        "ats_score": ats_score,
        "summary": _summary(ats_score, skills, best_role),
    }


def _extract_lines(text: str, markers: list[str], limit: int) -> list[str]:
    lines = [re.sub(r"\s+", " ", line).strip(" -•\t") for line in text.splitlines()]
    matches = [line for line in lines if 15 <= len(line) <= 180 and any(marker in line.lower() for marker in markers)]
    return matches[:limit]


def _domains_from_skills(skills: list[str]) -> list[str]:
    domains = []
    if {"react", "node", "fastapi", "django", "typescript"}.intersection(skills):
        domains.append("Full Stack Engineering")
    if {"machine learning", "deep learning", "nlp", "pandas", "numpy"}.intersection(skills):
        domains.append("AI/ML")
    if {"data structures", "algorithms", "oop", "dbms"}.intersection(skills):
        domains.append("Core CS")
    return domains or ["Software Engineering"]


def _summary(score: int, skills: list[str], role: str) -> str:
    if score >= 80:
        return f"Strong resume for {role}; keep adding quantified outcomes and role-specific keywords."
    if skills:
        return f"Promising resume for {role}; strengthen project impact, missing keywords, and measurable achievements."
    return "Resume text was sparse. Add skills, projects, internships, achievements, and role-specific keywords."
