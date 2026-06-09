from pydantic import BaseModel


class DashboardResponse(BaseModel):
    readiness_percentage: int
    total_interviews: int
    average_score: int
    weak_topics: list[str]
    topic_scores: dict[str, int]
    skill_performance: list[dict]
    improvement_trend: list[dict]
    recent_interviews: list[dict]
