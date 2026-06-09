from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.ai.provider import evaluate_answer, generate_questions
from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.interview import Evaluation, Interview, InterviewAnswer, InterviewQuestion
from app.models.resume import Resume
from app.models.user import User
from app.schemas.interview import (
    AnswerEvaluationResponse,
    GenerateInterviewRequest,
    InterviewResponse,
    SubmitAnswerRequest,
)

router = APIRouter(prefix="/interviews", tags=["Mock Interviews"])


@router.post("/generate", response_model=InterviewResponse)
async def create_interview(
    payload: GenerateInterviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = None
    if payload.resume_id:
        resume = db.query(Resume).filter(Resume.id == payload.resume_id, Resume.user_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
    skills = resume.skills if resume else []
    interview = Interview(
        user_id=current_user.id,
        role=payload.role,
        difficulty=payload.difficulty,
        company_mode=payload.company_mode,
    )
    db.add(interview)
    db.flush()
    generated = await generate_questions({**payload.model_dump(), "skills": skills})
    for item in generated:
        db.add(InterviewQuestion(interview_id=interview.id, **item))
    db.commit()
    return _load_interview(db, interview.id, current_user.id)


@router.get("", response_model=list[InterviewResponse])
def list_interviews(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Interview)
        .options(selectinload(Interview.questions))
        .filter(Interview.user_id == current_user.id)
        .order_by(Interview.created_at.desc())
        .all()
    )


@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(interview_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return _load_interview(db, interview_id, current_user.id)


@router.post("/{interview_id}/questions/{question_id}/answer", response_model=AnswerEvaluationResponse)
async def submit_answer(
    interview_id: int,
    question_id: int,
    payload: SubmitAnswerRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    interview = db.query(Interview).filter(Interview.id == interview_id, Interview.user_id == current_user.id).first()
    question = db.query(InterviewQuestion).filter(
        InterviewQuestion.id == question_id,
        InterviewQuestion.interview_id == interview_id,
    ).first()
    if not interview or not question:
        raise HTTPException(status_code=404, detail="Interview question not found")
    answer = InterviewAnswer(question_id=question.id, answer_text=payload.answer_text)
    db.add(answer)
    db.flush()
    result = await evaluate_answer(question.prompt, payload.answer_text, question.category)
    evaluation = Evaluation(interview_id=interview.id, answer_id=answer.id, **result)
    db.add(evaluation)
    db.flush()
    scores = [item.score for item in interview.evaluations] + [evaluation.score]
    interview.overall_score = round(sum(scores) / len(scores))
    if len(scores) >= len(interview.questions):
        interview.status = "completed"
        interview.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(evaluation)
    return {"answer_id": answer.id, "evaluation": evaluation}


def _load_interview(db: Session, interview_id: int, user_id: int):
    interview = (
        db.query(Interview)
        .options(selectinload(Interview.questions))
        .filter(Interview.id == interview_id, Interview.user_id == user_id)
        .first()
    )
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview
