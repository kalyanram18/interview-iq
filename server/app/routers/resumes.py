from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume import ResumeAnalysisResponse
from app.services.resume_service import analyze_resume_text, extract_pdf_text

router = APIRouter(prefix="/resumes", tags=["Resume Analyzer"])


@router.post("/upload", response_model=ResumeAnalysisResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in {"application/pdf", "application/octet-stream"} or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF resumes are supported")
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Resume file must be under 5 MB")
    text = await extract_pdf_text(contents)
    if len(text) < 40:
        raise HTTPException(status_code=400, detail="Could not extract enough text from this PDF")
    analysis = analyze_resume_text(text)
    resume = Resume(user_id=current_user.id, file_name=file.filename, raw_text=text, **analysis)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


@router.get("", response_model=list[ResumeAnalysisResponse])
def list_resumes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
