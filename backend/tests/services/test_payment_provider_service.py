# tests/services/test_payment_provider_service.py

import json

from app.config import settings
from app.database import SessionLocal
from app.models.campaign import Campaign
from app.models.donation import Donation, DonationStatus
from app.services.payment_provider_service import (
    create_payment_session,
    verify_webhook_signature,
    parse_webhook_event,
    apply_webhook_to_donation,
    _compute_signature,
    WebhookSignatureError,
)

def _get_or_create_campaign(db, slug: str) -> Campaign:
    """
    Helper for tests: reuse existing campaign with given slug if it exists,
    otherwise create a fresh one. This makes tests idempotent.
    """
    campaign = db.query(Campaign).filter(Campaign.slug == slug).one_or_none()
    if campaign:
        return campaign

    campaign = Campaign(
        name="Webhook Test Campaign",
        slug=slug,
        currency="UGX",
        # status will use model default (e.g. ACTIVE)
        is_featured=False,
    )
    db.add(campaign)
    db.flush()
    return campaign

def _create_dummy_donation(db, payment_method: str = "card") -> Donation:
    """
    Create a donation for a test campaign; reuses campaign if it already exists.
    """
    slug = f"webhook-test-{payment_method}"
    campaign = _get_or_create_campaign(db, slug)

    donation = Donation(
        amount=10_000,
        currency="UGX",
        donor_email=f"{payment_method}@example.com",
        payment_method=payment_method,
        payment_provider="dummy",
        campaign_id=campaign.id,
        status=DonationStatus.PENDING,
    )

    db.add(donation)
    db.commit()
    db.refresh(donation)
    return donation


def test_create_payment_session_for_card_mtn_airtel(monkeypatch):
    db = SessionLocal()
    try:
        monkeypatch.setattr(settings, "payment_provider_name", "dummy")

        for method in ["card", "mtn_momo", "airtel_momo"]:
            donation = _create_dummy_donation(db, payment_method=method)
            info = create_payment_session(db, donation)

            assert info["provider"] == "dummy"
            assert info["payment_method"] == method
            assert "session_id" in info
            assert "payment_url" in info

            db.refresh(donation)
            assert donation.payment_provider == "dummy"
            assert donation.provider_session_id == info["session_id"]
            assert donation.provider_payment_id == info["session_id"]
            assert donation.provider_status == "created"
    finally:
        db.close()


def test_verify_webhook_signature_ok(monkeypatch):
    secret = "testsecret"
    monkeypatch.setattr(settings, "payment_webhook_secret", secret)

    body = b'{"test": "value"}'
    good_sig = _compute_signature(secret, body)

    # Should not raise
    verify_webhook_signature(body, good_sig)


def test_verify_webhook_signature_invalid(monkeypatch):
    secret = "testsecret"
    monkeypatch.setattr(settings, "payment_webhook_secret", secret)

    body = b'{"test": "value"}'
    bad_sig = "deadbeef"

    try:
        verify_webhook_signature(body, bad_sig)
        assert False, "Expected WebhookSignatureError"
    except WebhookSignatureError:
        pass


def test_apply_webhook_to_donation_updates_status(monkeypatch):
    db = SessionLocal()
    try:
        monkeypatch.setattr(settings, "payment_provider_name", "dummy")

        donation = _create_dummy_donation(db, payment_method="mtn_momo")

        # create fake session
        info = create_payment_session(db, donation)
        session_id = info["session_id"]

        event = {
            "provider": "dummy",
            "event_type": "payment.success",
            "session_id": session_id,
            "status": "success",
            "amount": 100_000,
            "currency": "UGX",
            "payment_method": "mtn_momo",
        }

        donation2, new_status = apply_webhook_to_donation(db, event)

        assert donation2.id == donation.id
        assert new_status == DonationStatus.CONFIRMED
        assert donation2.status == DonationStatus.CONFIRMED
        assert donation2.provider_status == "success"
    finally:
        db.close()

