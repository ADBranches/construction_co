# backend/app/models/media.py
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    String,
    Boolean,
    Text,
    DateTime,
    Enum,
    ForeignKey,
    func,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class MediaType(str, PyEnum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"


class Media(Base):
    __tablename__ = "media"
    __table_args__ = (
        Index("ix_media_project_id", "project_id"),
        Index("ix_media_is_featured", "is_featured"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=True,
    )

    title: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    media_type: Mapped[MediaType] = mapped_column(
        Enum(MediaType, name="media_type"),
        default=MediaType.IMAGE,
        nullable=False,
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    sort_order: Mapped[int] = mapped_column(
        default=0,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    project: Mapped["Project | None"] = relationship(
        "Project",
        back_populates="media_items",
    )

    def __repr__(self) -> str:
        return f"<Media id={self.id} type={self.media_type} url={self.url!r}>"
