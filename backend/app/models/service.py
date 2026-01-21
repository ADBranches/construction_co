# backend/app/models/service.py
import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, Integer, Text, DateTime, func, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..database import Base


class Service(Base):
    __tablename__ = "services"
    __table_args__ = (
        Index("ix_services_slug", "slug", unique=True),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        unique=True,
    )

    slug: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        unique=True,
    )

    short_description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    # Optional marketing fields for richer frontend cards/pages
    tagline: Mapped[str | None] = mapped_column(String(255), nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    hero_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    icon: Mapped[str | None] = mapped_column(String(100), nullable=True)

    highlight_1: Mapped[str | None] = mapped_column(String(255), nullable=True)
    highlight_2: Mapped[str | None] = mapped_column(String(255), nullable=True)
    highlight_3: Mapped[str | None] = mapped_column(String(255), nullable=True)

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
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
    projects: Mapped[list["Project"]] = relationship(
        back_populates="service",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Service id={self.id} name={self.name!r}>"
