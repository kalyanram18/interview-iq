from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.database.session import Base, engine
from app.models import Evaluation, Interview, InterviewAnswer, InterviewQuestion, Resume, Roadmap, User
from app.routers import auth, dashboard, interviews, resumes, roadmaps

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InterviewIQ API",
    version="1.0.0",
    description="AI Interview Intelligence Platform API for resume analysis, mock interviews, evaluations, analytics, and roadmaps.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_origin, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(resumes.router, prefix="/api")
app.include_router(interviews.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(roadmaps.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok", "service": "interviewiq"}
