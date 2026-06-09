from datetime import datetime
from pydantic import BaseModel


class RoadmapRequest(BaseModel):
    focus_role: str = "SDE"


class RoadmapResponse(BaseModel):
    id: int
    title: str
    focus_role: str
    weak_topics: list[str]
    daily_plan: list[dict]
    weekly_plan: list[dict]
    priority_topics: list[str]
    suggested_problems: list[dict]
    summary: str
    created_at: datetime

    model_config = {"from_attributes": True}
