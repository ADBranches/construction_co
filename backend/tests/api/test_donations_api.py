# tests/api/test_donations_api.py

from uuid import uuid4

from app.models.donation import DonationStatus


def _unique_slug(base: str) -> str:
    """
    Generate a unique slug per test run so tests don't collide
    with existing campaigns in the DB.
    """
    return f"{base}-{uuid4().hex[:8]}"


def _create_test_campaign(client, admin_token_headers, slug: str = "donation-campaign"):
    payload = {
        "name": "Donation Test Campaign",
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
    assert resp.status_code == 201, resp.text
    return resp.json()


def test_post_donation_creates_pending_record(client, admin_token_headers):
    # unique slug for this test
    campaign = _create_test_campaign(
        client,
        admin_token_headers,
        slug=_unique_slug("donations-main"),
    )
    campaign_id = campaign["id"]

    payload = {
        "amount": 100_000,
        "currency": "UGX",
        "donor_name": "Jane Donor",
        "donor_email": "jane@example.com",
        "donor_phone": "+256700000000",
        "is_anonymous": False,
        "message": "Happy to support your work!",
        "campaign_id": campaign_id,
        "payment_method": "card",
    }

    resp = client.post("/api/v1/donations", json=payload)
    assert resp.status_code == 201, resp.text

    # NEW: intent-style response
    intent = resp.json()
    donation = intent["donation"]

    assert donation["id"]
    # Public schema doesn't expose provider metadata
    assert donation["amount"] == payload["amount"]
    assert donation["currency"] == payload["currency"]
    assert donation["status"] == DonationStatus.PENDING.value
    assert donation["campaign_id"] == campaign_id


def test_post_donation_rejects_non_positive_amount(client):
    payload = {
        "amount": 0,
        "currency": "UGX",
    }

    resp = client.post("/api/v1/donations", json=payload)
    assert resp.status_code == 400
    assert "greater than zero" in resp.json()["detail"].lower()


def test_admin_can_list_donations(client, admin_token_headers):
    # Create campaign + one donation with a unique slug
    campaign = _create_test_campaign(
        client,
        admin_token_headers,
        slug=_unique_slug("donations-list"),
    )
    campaign_id = campaign["id"]

    client.post(
        "/api/v1/donations",
        json={
            "amount": 50_000,
            "currency": "UGX",
            "campaign_id": campaign_id,
            "payment_method": "card",
        },
    )

    # admin list
    resp = client.get(
        "/api/v1/donations",
        headers=admin_token_headers,
    )
    assert resp.status_code == 200, resp.text
    items = resp.json()
    assert isinstance(items, list)
    assert any(d["campaign_id"] == campaign_id for d in items)


def test_admin_get_single_donation(client, admin_token_headers):
    campaign = _create_test_campaign(
        client,
        admin_token_headers,
        slug=_unique_slug("donations-single"),
    )
    campaign_id = campaign["id"]

    resp_create = client.post(
        "/api/v1/donations",
        json={
            "amount": 75_000,
            "currency": "UGX",
            "campaign_id": campaign_id,
            "payment_method": "card",
        },
    )
    assert resp_create.status_code == 201, resp_create.text

    # NEW: extract id from nested donation
    intent = resp_create.json()
    donation_id = intent["donation"]["id"]

    resp_get = client.get(
        f"/api/v1/donations/{donation_id}",
        headers=admin_token_headers,
    )
    assert resp_get.status_code == 200
    data = resp_get.json()
    assert data["id"] == donation_id
    assert data["amount"] == 75_000
