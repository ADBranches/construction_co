# tests/test_models_donation.py

from uuid import uuid4

from app.database import SessionLocal
from app.models.campaign import Campaign
from app.models.donation import Donation, DonationStatus


def test_donation_create_with_campaign_and_defaults():
    db = SessionLocal()
    try:
        # Create a campaign to attach donation to
        slug = f"donation-campaign-{uuid4()}"
        campaign = Campaign(
            name="Donation Test Campaign",
            slug=slug,
            currency="UGX",
            target_amount=500_000,
        )
        db.add(campaign)
        db.commit()
        db.refresh(campaign)

        donation = Donation(
            amount=100_000,  # UGX 100k
            currency="UGX",
            donor_name="Test Donor",
            donor_email="test@example.com",
            donor_phone="+256700000000",
            is_anonymous=False,
            message="Keep up the good work.",
            campaign_id=campaign.id,
            payment_method="card",   # we are card-first
            payment_provider="stripe",  # placeholder, no logic yet
        )

        db.add(donation)
        db.commit()
        db.refresh(donation)

        # Basic sanity
        assert donation.id is not None
        assert donation.amount == 100_000
        assert donation.currency == "UGX"
        assert donation.campaign_id == campaign.id

        # Defaults
        assert donation.status == DonationStatus.PENDING
        assert donation.card_brand is None
        assert donation.card_last4 is None
        assert donation.created_at is not None
        assert donation.updated_at is not None

        # Relationship should work
        assert donation.campaign is not None
        assert donation.campaign.slug == slug
    finally:
        db.close()


def test_donation_status_enum_values():
    """
    Simple guard to ensure the enum string values are as expected.
    Useful later when mapping from payment provider statuses.
    """
    assert DonationStatus.PENDING.value == "pending"
    assert DonationStatus.CONFIRMED.value == "confirmed"
    assert DonationStatus.FAILED.value == "failed"
    assert DonationStatus.REFUNDED.value == "refunded"

