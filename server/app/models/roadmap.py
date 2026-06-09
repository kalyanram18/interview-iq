from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    focus_role: Mapped[str] = mapped_column(String(120), default="SDE")
    weak_topics: Mapped[list] = mapped_column(JSON, default=list)
    daily_plan: Mapped[list] = mapped_column(JSON, default=list)
    weekly_plan: Mapped[list] = mapped_column(JSON, default=list)
    priority_topics: Mapped[list] = mapped_column(JSON, default=list)
    suggested_problems: Mapped[list] = mapped_column(JSON, default=list)
    summary: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="roadmaps")
