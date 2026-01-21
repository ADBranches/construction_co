# backend/app/models/project.py
import uuid
from datetime import datetime, date
from enum import Enum as PyEnum

from sqlalchemy import (
    String,
    Boolean,
    Text,
    DateTime,
    Date,
    Numeric,
    Enum,
    ForeignKey,
    func,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class ProjectStatus(str, PyEnum):
    PLANNED = "PLANNED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    ON_HOLD = "ON_HOLD"


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = (
        Index("ix_projects_slug", "slug", unique=True),
        Index("ix_projects_status", "status"),
        Index("ix_projects_service_id", "service_id"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    
        # 🔹 CMS-friendly fields
    short_description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    budget: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )  # human-readable e.g. "50M UGX"

    hero_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )  # main hero banner


    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    client_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    budget_amount: Mapped[float | None] = mapped_column(
        Numeric(14, 2),
        nullable=True,
    )

    start_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    end_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus, name="project_status"),
        default=ProjectStatus.ONGOING,
        nullable=False,
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    cover_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # FK -> services.id
    service_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("services.id", ondelete="SET NULL"),
        nullable=True,
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
    service: Mapped["Service | None"] = relationship(
        back_populates="projects",
    )

    media_items: Mapped[list["Media"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )

    inquiries: Mapped[list["Inquiry"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id} name={self.name!r} status={self.status}>"
