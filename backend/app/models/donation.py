# app/models/donation.py
from __future__ import annotations

from datetime import datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    Enum as SAEnum,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class DonationStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    FAILED = "failed"
    REFUNDED = "refunded"


class Donation(Base):
    __tablename__ = "donations"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        index=True,
        default=uuid4,
        nullable=False,
    )

    # Money
    # For now: store major units (UGX, etc.). We can later switch to "amount_minor".
    amount = Column(Integer, nullable=False)
    currency = Column(String(3), nullable=False, default="UGX")

    status = Column(
        SAEnum(DonationStatus, name="donation_status"),
        nullable=False,
        default=DonationStatus.PENDING,
    )

    # Donor info (minimal PII – no card here)
    donor_name = Column(String(150), nullable=True)
    donor_email = Column(String(255), nullable=True)
    donor_phone = Column(String(50), nullable=True)
    is_anonymous = Column(Boolean, nullable=False, default=False)
    message = Column(Text, nullable=True)
    provider_session_id = Column(String(100), nullable=True)

    # Link to campaign (optional – can be general fund)
    campaign_id = Column(
        UUID(as_uuid=True),
        ForeignKey("campaigns.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Payment metadata (card + provider)
    payment_method = Column(String(50), nullable=True, default="card")
    payment_provider = Column(String(50), nullable=True)  # e.g. "stripe", "flutterwave"

    provider_payment_id = Column(String(100), nullable=True)   # charge/payment_intent id
    provider_customer_id = Column(String(100), nullable=True)
    provider_session_id = Column(String(100), nullable=True)   # checkout session id
    provider_status = Column(String(50), nullable=True)

    # Card fingerprint (non-sensitive bits)
    card_brand = Column(String(30), nullable=True)   # "visa", "mastercard"
    card_last4 = Column(String(4), nullable=True)
    card_exp_month = Column(Integer, nullable=True)
    card_exp_year = Column(Integer, nullable=True)

    # Optional technical metadata
    ip_address = Column(String(45), nullable=True)         # IPv4 / IPv6
    user_agent = Column(String(300), nullable=True)

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

    campaign = relationship("Campaign", back_populates="donations")

    def __repr__(self) -> str:  # pragma: no cover
        return f"<Donation {self.id} {self.amount}{self.currency} ({self.status})>"
