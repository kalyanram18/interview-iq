from datetime import datetime
from pydantic import BaseModel, Field


class GenerateInterviewRequest(BaseModel):
    role: str = "SDE"
    difficulty: str = Field(default="medium", pattern="^(easy|medium|hard)$")
    company_mode: str = "Generic"
    question_count: int = Field(default=8, ge=3, le=15)
    resume_id: int | None = None


class QuestionResponse(BaseModel):
    id: int
    category: str
    prompt: str
    expected_signals: list[str]
    order_index: int

    model_config = {"from_attributes": True}


class InterviewResponse(BaseModel):
    id: int
    role: str
    difficulty: str
    company_mode: str
    status: str
    overall_score: int
    created_at: datetime
    completed_at: datetime | None
    questions: list[QuestionResponse] = []

    model_config = {"from_attributes": True}


class SubmitAnswerRequest(BaseModel):
    answer_text: str = Field(min_length=3)


class EvaluationResponse(BaseModel):
    id: int
    score: int
    technical_accuracy: int
    communication: int
    confidence: int
    depth: int
    problem_solving: int
    strengths: list[str]
    weaknesses: list[str]
    improvements: list[str]

    model_config = {"from_attributes": True}


class AnswerEvaluationResponse(BaseModel):
    answer_id: int
    evaluation: EvaluationResponse
