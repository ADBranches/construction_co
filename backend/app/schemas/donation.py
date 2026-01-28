# app/schemas/donation.py
from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.donation import DonationStatus


class DonationBase(BaseModel):
    amount: int                      # major units (e.g. UGX)
    currency: str = "UGX"

    donor_name: Optional[str] = None
    donor_email: Optional[EmailStr] = None
    donor_phone: Optional[str] = None

    is_anonymous: bool = False
    message: Optional[str] = None

    campaign_id: Optional[UUID] = None


class DonationCreate(DonationBase):
    """
    Public-facing payload for creating a donation intent.

    Supports payment_method:
    - "card"
    - "mtn_momo"
    - "airtel_momo"
    """
    payment_method: str = "card"


class DonationPublic(DonationBase):
    """
    What we can safely show back to a donor or on a thank-you page.
    No internal provider IDs or card fingerprint.
    """
    id: UUID
    status: DonationStatus
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DonationAdmin(DonationPublic):
    """
    Admin / back-office view with card & provider metadata.
    Still no full card numbers – only last4 & brand.
    """
    payment_method: Optional[str] = None
    payment_provider: Optional[str] = None

    provider_payment_id: Optional[str] = None
    provider_customer_id: Optional[str] = None
    provider_status: Optional[str] = None

    card_brand: Optional[str] = None
    card_last4: Optional[str] = None
    card_exp_month: Optional[int] = None
    card_exp_year: Optional[int] = None

    ip_address: Optional[str] = None
    user_agent: Optional[str] = None


class DonationIntentResponse(BaseModel):
    """
    Response for POST /donations when creating a payment session.

    - donation: sanitized public view of the donation
    - payment_url: URL to redirect the donor to (card checkout / MoMo)
    - provider_session_id: provider-side session/checkout id
    """
    donation: DonationPublic
    payment_url: Optional[str] = None
    provider_session_id: Optional[str] = None
