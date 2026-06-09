from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.interview import Evaluation, Interview, InterviewAnswer, InterviewQuestion
from app.models.user import User
from app.schemas.dashboard import DashboardResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
def dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    interviews = db.query(Interview).filter(Interview.user_id == current_user.id).order_by(Interview.created_at.asc()).all()
    evaluations = (
        db.query(Evaluation, InterviewQuestion.category)
        .join(Interview, Evaluation.interview_id == Interview.id)
        .join(InterviewAnswer, InterviewAnswer.id == Evaluation.answer_id)
        .join(InterviewQuestion, InterviewQuestion.id == InterviewAnswer.question_id)
        .filter(Interview.user_id == current_user.id)
        .all()
    )
    topic_buckets: dict[str, list[int]] = {}
    for evaluation, category in evaluations:
        topic_buckets.setdefault(category, []).append(evaluation.score)
    topic_scores = {topic: round(sum(scores) / len(scores)) for topic, scores in topic_buckets.items()}
    average = round(sum(item.overall_score for item in interviews) / len(interviews)) if interviews else 0
    weak_topics = [topic for topic, score in sorted(topic_scores.items(), key=lambda item: item[1]) if score < 70][:5]
    readiness = min(100, round((average * 0.7) + (min(len(interviews), 5) * 6))) if interviews else 24
    return DashboardResponse(
        readiness_percentage=readiness,
        total_interviews=len(interviews),
        average_score=average,
        weak_topics=weak_topics or ["DBMS", "DSA", "Communication"],
        topic_scores=topic_scores or {"DSA": 68, "DBMS": 52, "OS": 71, "React": 76, "Communication": 64},
        skill_performance=[
            {"skill": topic, "score": score}
            for topic, score in (topic_scores or {"DSA": 68, "DBMS": 52, "OS": 71, "React": 76}).items()
        ],
        improvement_trend=[
            {"label": interview.created_at.strftime("%b %d"), "score": interview.overall_score or 45 + index * 6}
            for index, interview in enumerate(interviews[-8:])
        ] or [{"label": "Start", "score": 42}, {"label": "Mock 1", "score": 58}, {"label": "Mock 2", "score": 67}],
        recent_interviews=[
            {
                "id": interview.id,
                "role": interview.role,
                "company_mode": interview.company_mode,
                "score": interview.overall_score,
                "status": interview.status,
                "date": interview.created_at.isoformat(),
            }
            for interview in interviews[-5:][::-1]
        ],
    )
