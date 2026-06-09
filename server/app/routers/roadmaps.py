from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.ai.provider import generate_roadmap
from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.roadmap import Roadmap
from app.models.user import User
from app.routers.dashboard import dashboard
from app.schemas.roadmap import RoadmapRequest, RoadmapResponse

router = APIRouter(prefix="/roadmaps", tags=["Roadmaps"])


@router.post("/generate", response_model=RoadmapResponse)
async def create_roadmap(
    payload: RoadmapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    analytics = dashboard(db=db, current_user=current_user)
    generated = await generate_roadmap({"focus_role": payload.focus_role, "weak_topics": analytics.weak_topics})
    roadmap = Roadmap(user_id=current_user.id, focus_role=payload.focus_role, **generated)
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    return roadmap


@router.get("", response_model=list[RoadmapResponse])
def list_roadmaps(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Roadmap).filter(Roadmap.user_id == current_user.id).order_by(Roadmap.created_at.desc()).all()
