from datetime import datetime
from pydantic import BaseModel


class ResumeAnalysisResponse(BaseModel):
    id: int
    file_name: str
    ats_score: int
    skills: list[str]
    technologies: list[str]
    projects: list[str]
    experience: list[str]
    certifications: list[str]
    dominant_domains: list[str]
    suitable_roles: list[str]
    missing_keywords: list[str]
    summary: str
    created_at: datetime

    model_config = {"from_attributes": True}
