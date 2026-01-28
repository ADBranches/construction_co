# app/models/campaign.py
from __future__ import annotations

from datetime import datetime, date
from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Integer,
    String,
    Text,
    Enum as SAEnum,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class CampaignStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    ARCHIVED = "archived"


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        default=uuid4,
        nullable=False,
    )

    name = Column(String(200), nullable=False)
    slug = Column(String(200), nullable=False, unique=True, index=True)

    short_description = Column(String(300), nullable=True)
    description = Column(Text, nullable=True)

    currency = Column(String(3), nullable=False, default="UGX")

    # store in major units for now (e.g. UGX)
    target_amount = Column(Integer, nullable=True)
    raised_amount = Column(Integer, nullable=False, default=0)

    status = Column(
        SAEnum(CampaignStatus, name="campaign_status"),
        nullable=False,
        default=CampaignStatus.ACTIVE,
    )

    is_featured = Column(Boolean, nullable=False, default=False)
    sort_order = Column(Integer, nullable=False, default=0)

    hero_image_url = Column(String(500), nullable=True)

    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # relationships
    donations = relationship(
        "Donation",
        back_populates="campaign",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Campaign {self.slug} ({self.status})>"
