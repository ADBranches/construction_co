# app/models/testimonial.py
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    String,
    Text,
    Integer,
    func,
    Index,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"
    __table_args__ = (
        Index("ix_testimonials_is_active", "is_active"),
        Index("ix_testimonials_is_featured", "is_featured"),
        Index("ix_testimonials_display_order", "display_order"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # 🔹 Tests expect: client_name
    # 🔹 DB already has: "name"
    client_name: Mapped[str] = mapped_column(
        "name",
        String(255),
        nullable=False,
    )

    # 🔹 Tests expect: client_role
    # 🔹 DB already has: "role"
    client_role: Mapped[str | None] = mapped_column(
        "role",
        String(255),
        nullable=True,
    )

    company: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # 🔹 Tests expect: message
    # 🔹 DB already has: "quote"
    message: Mapped[str] = mapped_column(
        "quote",
        Text,
        nullable=False,
    )

    # 🔹 New optional rating
    rating: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    is_featured: Mapped[bool] = mapped_column(
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

    def __repr__(self) -> str:
        return f"<Testimonial id={self.id} client_name={self.client_name!r}>"

