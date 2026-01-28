# tests/test_models_campaign.py

from uuid import uuid4

from sqlalchemy.exc import IntegrityError

from app.database import SessionLocal
from app.models.campaign import Campaign, CampaignStatus


def test_campaign_create_defaults():
    db = SessionLocal()
    try:
        slug = f"test-campaign-{uuid4()}"
        campaign = Campaign(
            name="Test Campaign",
            slug=slug,
            currency="UGX",
            target_amount=1_000_000,
        )

        db.add(campaign)
        db.commit()
        db.refresh(campaign)

        # Basic fields
        assert campaign.id is not None
        assert campaign.slug == slug
        assert campaign.currency == "UGX"

        # Defaults
        assert campaign.status == CampaignStatus.ACTIVE
        assert campaign.raised_amount == 0
        assert campaign.is_featured is False
        assert campaign.sort_order == 0
        assert campaign.created_at is not None
        assert campaign.updated_at is not None
    finally:
        db.close()


def test_campaign_slug_uniqueness():
    """
    DB has a UNIQUE constraint on slug.
    Creating two campaigns with same slug should raise IntegrityError.
    """
    db = SessionLocal()
    try:
        slug = f"test-campaign-unique-{uuid4()}"

        c1 = Campaign(name="Campaign 1", slug=slug)
        c2 = Campaign(name="Campaign 2", slug=slug)

        db.add(c1)
        db.commit()  # first commit should succeed

        db.add(c2)
        try:
            db.commit()
            # If we get here, uniqueness isn't enforced
            assert False, "Expected IntegrityError for duplicate slug"
        except IntegrityError:
            db.rollback()
    finally:
        db.close()

