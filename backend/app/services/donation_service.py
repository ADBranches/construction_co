# app/services/donation_service.py
from __future__ import annotations

from app.utils.email_sender import send_donation_receipt

from typing import Iterable, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.campaign import Campaign, CampaignStatus
from app.models.donation import Donation, DonationStatus
from app.schemas.donation import DonationCreate


def get_campaign_or_none(db: Session, campaign_id: Optional[UUID]) -> Optional[Campaign]:
    if campaign_id is None:
        return None
    return db.query(Campaign).filter(Campaign.id == campaign_id).first()


def create_donation(
    db: Session,
    payload: DonationCreate,
    *,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> Donation:
    """
    Create a Donation in PENDING state.
    No payment provider call yet – that comes in Phase 3.
    """
    campaign = get_campaign_or_none(db, payload.campaign_id)

    if campaign and campaign.status not in (CampaignStatus.ACTIVE, CampaignStatus.DRAFT):
        # We allow DRAFT in case you want to accept early gifts for new campaigns.
        raise ValueError("Campaign is not accepting donations at this time.")

    donation = Donation(
        amount=payload.amount,
        currency=payload.currency,
        donor_name=payload.donor_name,
        donor_email=str(payload.donor_email) if payload.donor_email else None,
        donor_phone=payload.donor_phone,
        is_anonymous=payload.is_anonymous,
        message=payload.message,
        campaign_id=payload.campaign_id,
        payment_method=payload.payment_method,
        status=DonationStatus.PENDING,
        ip_address=ip_address,
        user_agent=user_agent,
    )

    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation


def list_donations(
    db: Session,
    *,
    status_: DonationStatus | None = None,
    campaign_id: UUID | None = None,
    donor_email: str | None = None,
    skip: int = 0,
    limit: int = 100,
) -> Iterable[Donation]:
    query = db.query(Donation)

    if status_ is not None:
        query = query.filter(Donation.status == status_)

    if campaign_id is not None:
        query = query.filter(Donation.campaign_id == campaign_id)

    if donor_email is not None:
        query = query.filter(Donation.donor_email == donor_email)

    query = query.order_by(Donation.created_at.desc())

    return query.offset(skip).limit(limit).all()


def get_donation(db: Session, donation_id: UUID) -> Optional[Donation]:
    return db.query(Donation).filter(Donation.id == donation_id).first()


def set_donation_status(
    db: Session,
    donation: Donation,
    status_: DonationStatus,
    provider_status: str | None = None,
) -> Donation:
    """
    Helper for future payment integration:
    update donation status and provider_status.
    """
    donation.status = status_
    if provider_status is not None:
        donation.provider_status = provider_status

    db.commit()
    db.refresh(donation)
    return donation

def mark_donation_confirmed(db: Session, donation: Donation) -> Donation:
    """
    Mark donation as confirmed and trigger side-effects (stats updates, email, etc).
    """
    from app.models.donation import DonationStatus  # if not already imported

    donation.status = DonationStatus.CONFIRMED
    db.add(donation)
    db.commit()
    db.refresh(donation)

    # 🔔 send receipt email (no crash if email missing)
    try:
        send_donation_receipt(donation)
    except Exception:  # we do not want email failure to break webhook flow
        # optionally log via your logger
        pass

    return donation
