# tests/api/test_donations_webhook.py

import json
import pytest

from app.config import settings
from app.models.donation import DonationStatus
from app.services.payment_provider_service import _compute_signature


def _create_test_campaign(client, admin_token_headers, slug: str):
    """
    Idempotent test helper:
    - Try to create campaign
    - If slug already exists, fetch and return the existing one
    """
    payload = {
        "name": f"Donation Campaign {slug}",
        "slug": slug,
        "short_description": "Test campaign for donations.",
        "currency": "UGX",
        "status": "active",
        "is_featured": False,
    }

    resp = client.post(
        "/api/v1/campaigns",
        json=payload,
        headers=admin_token_headers,
    )

    if resp.status_code == 201:
        return resp.json()

    # If slug already exists, reuse that campaign
    if resp.status_code == 400 and "slug already exists" in resp.text:
        list_resp = client.get("/api/v1/campaigns")
        assert list_resp.status_code == 200, list_resp.text
        campaigns = list_resp.json()
        for c in campaigns:
            if c.get("slug") == slug:
                return c

        pytest.fail(
            f"Campaign with slug {slug!r} already exists but could not be fetched."
        )

    # Any other error is truly unexpected
    assert resp.status_code == 201, resp.text


def test_donation_webhook_confirms_donation(client, admin_token_headers, monkeypatch):
    # 1) Create campaign + donation intent with MoMo
    campaign = _create_test_campaign(client, admin_token_headers, slug="webhook-mtn-momo")
    campaign_id = campaign["id"]

    monkeypatch.setattr(settings, "payment_provider_name", "dummy")
    monkeypatch.setattr(settings, "payment_webhook_secret", "testsecret")

    resp_intent = client.post(
        "/api/v1/donations",
        json={
            "amount": 120_000,
            "currency": "UGX",
            "campaign_id": campaign_id,
            "payment_method": "mtn_momo",
        },
    )
    assert resp_intent.status_code == 201, resp_intent.text
    wrapper = resp_intent.json()
    donation = wrapper["donation"]
    provider_session_id = wrapper["provider_session_id"]

    # 2) Build webhook payload
    event = {
        "provider": "dummy",
        "event_type": "payment.success",
        "session_id": provider_session_id,
        "status": "success",
        "amount": 120_000,
        "currency": "UGX",
        "payment_method": "mtn_momo",
    }
    body = json.dumps(event).encode("utf-8")
    signature = _compute_signature(settings.payment_webhook_secret, body)

    # 3) Call webhook endpoint
    resp_webhook = client.post(
        "/api/v1/donations/webhook",
        data=body,
        headers={"X-Payment-Signature": signature},
    )
    assert resp_webhook.status_code == 200, resp_webhook.text
    data = resp_webhook.json()
    assert data["ok"] is True
    assert data["status"] == DonationStatus.CONFIRMED.value

    # 4) Donation status should be updated when fetched via admin GET
    resp_get = client.get(
        f"/api/v1/donations/{donation['id']}",
        headers=admin_token_headers,
    )
    assert resp_get.status_code == 200
    updated = resp_get.json()
    assert updated["status"] == DonationStatus.CONFIRMED.value


def test_donation_webhook_invalid_signature_does_not_change_state(
    client, admin_token_headers, monkeypatch
):
    campaign = _create_test_campaign(client, admin_token_headers, slug="webhook-card")
    campaign_id = campaign["id"]

    monkeypatch.setattr(settings, "payment_provider_name", "dummy")
    monkeypatch.setattr(settings, "payment_webhook_secret", "testsecret")

    # Create card intent
    resp_intent = client.post(
        "/api/v1/donations",
        json={
            "amount": 80_000,
            "currency": "UGX",
            "campaign_id": campaign_id,
            "payment_method": "card",
        },
    )
    assert resp_intent.status_code == 201
    wrapper = resp_intent.json()
    donation = wrapper["donation"]
    provider_session_id = wrapper["provider_session_id"]

    # Build payload but use WRONG signature
    event = {
        "provider": "dummy",
        "event_type": "payment.success",
        "session_id": provider_session_id,
        "status": "success",
        "amount": 80_000,
        "currency": "UGX",
        "payment_method": "card",
    }
    body = json.dumps(event).encode("utf-8")
    bad_signature = "deadbeef"

    resp_webhook = client.post(
        "/api/v1/donations/webhook",
        data=body,
        headers={"X-Payment-Signature": bad_signature},
    )
    assert resp_webhook.status_code == 400

    # Donation should still be PENDING
    resp_get = client.get(
        f"/api/v1/donations/{donation['id']}",
        headers=admin_token_headers,
    )
    assert resp_get.status_code == 200
    updated = resp_get.json()
    assert updated["status"] == DonationStatus.PENDING.value

