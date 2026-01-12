# backend/app/models/inquiry.py
import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    String,
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


class InquiryStatus(str, PyEnum):
    NEW = "NEW"
    IN_REVIEW = "IN_REVIEW"
    QUOTED = "QUOTED"
    CLOSED = "CLOSED"


class Inquiry(Base):
    __tablename__ = "inquiries"
    __table_args__ = (
        Index("ix_inquiries_status", "status"),
        Index("ix_inquiries_created_at", "created_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    project_type: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    budget_range: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[InquiryStatus] = mapped_column(
        Enum(InquiryStatus, name="inquiry_status"),
        default=InquiryStatus.NEW,
        nullable=False,
    )

    source: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        doc="E.g. website, referral, social_media, etc.",
    )

    # Optional links to service/project for context
    service_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("services.id", ondelete="SET NULL"),
        nullable=True,
    )

    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id", ondelete="SET NULL"),
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
        "Service",
        backref="inquiries",
    )

    project: Mapped["Project | None"] = relationship(
        "Project",
        back_populates="inquiries",
    )

    def __repr__(self) -> str:
        return f"<Inquiry id={self.id} status={self.status}>"
