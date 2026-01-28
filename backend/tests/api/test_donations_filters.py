# tests/api/test_donations_filters.py
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from app.models.donation import Donation, DonationStatus
from app.models.campaign import Campaign, CampaignStatus
from app.database import SessionLocal


def create_campaign(db, name="Test Campaign", slug=None):
    """
    Helper that ALWAYS generates a unique slug, even if a base slug is passed.
    This avoids clashing with existing campaigns in the real DB.
    """
    base_slug = slug or "test-campaign"
    unique_slug = f"{base_slug}-{uuid4().hex[:8]}"

    campaign = Campaign(
        name=name,
        slug=unique_slug,
        status=CampaignStatus.ACTIVE,
        target_amount=1_000_000,
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


def create_donation(
    db,
    *,
    campaign_id=None,
    amount=50000,
    status=DonationStatus.PENDING,
    created_at=None,
):
    donation = Donation(
        amount=amount,
        currency="UGX",
        status=status,
        campaign_id=campaign_id,
        donor_name="Test Donor",
        donor_email="test@example.com",
    )
    if created_at is not None:
        donation.created_at = created_at  # type: ignore[attr-defined]

    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation


def test_list_donations_filter_by_campaign(client, admin_token_headers):
    db = SessionLocal()
    try:
        campaign_a = create_campaign(db, name="A", slug="a")
        campaign_b = create_campaign(db, name="B", slug="b")

        d1 = create_donation(db, campaign_id=campaign_a.id, amount=10000)
        d2 = create_donation(db, campaign_id=campaign_b.id, amount=20000)

        # Capture primitive IDs BEFORE closing the session
        campaign_a_id = str(campaign_a.id)
        d1_id = str(d1.id)
        d2_id = str(d2.id)
    finally:
        db.close()

    resp = client.get(
        f"/api/v1/donations?campaign_id={campaign_a_id}",
        headers=admin_token_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    ids = {item["id"] for item in data}
    assert d1_id in ids
    assert d2_id not in ids


def test_list_donations_filter_by_status(client, admin_token_headers):
    db = SessionLocal()
    try:
        c = create_campaign(db)
        pending = create_donation(db, campaign_id=c.id, status=DonationStatus.PENDING)
        confirmed = create_donation(
            db, campaign_id=c.id, status=DonationStatus.CONFIRMED
        )
        # We don't need their IDs later for this assertion – just statuses
    finally:
        db.close()

    resp = client.get(
        "/api/v1/donations?status=confirmed",
        headers=admin_token_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    statuses = {item["status"] for item in data}
    assert "confirmed" in statuses
    assert "pending" not in statuses


def test_list_donations_filter_by_date_range(client, admin_token_headers):
    db = SessionLocal()
    try:
        c = create_campaign(db)
        now = datetime.now(timezone.utc)

        old = create_donation(
            db,
            campaign_id=c.id,
            created_at=now - timedelta(days=10),
        )
        recent = create_donation(
            db,
            campaign_id=c.id,
            created_at=now - timedelta(days=1),
        )

        # Capture IDs before closing
        old_id = str(old.id)
        recent_id = str(recent.id)
    finally:
        db.close()

    date_from = (now - timedelta(days=3)).isoformat()

    resp = client.get(
        f"/api/v1/donations?date_from={date_from}",
        headers=admin_token_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    ids = {item["id"] for item in data}
    assert recent_id in ids
    assert old_id not in ids
