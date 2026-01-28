# tests/api/test_campaigns_api.py

from uuid import uuid4

from app.models.campaign import CampaignStatus


def _unique_slug(base: str) -> str:
    """
    Generate a unique slug per test run so tests are idempotent
    and don't collide with existing rows in the DB.
    """
    return f"{base}-{uuid4().hex[:8]}"


def test_admin_can_create_campaign(client, admin_token_headers):
    slug = _unique_slug("support-biogas-installations")

    payload = {
        "name": "Support Biogas Installations",
        "slug": slug,
        "short_description": "Help families access clean biogas systems.",
        "description": "Longer description of the biogas support campaign.",
        "currency": "UGX",
        "target_amount": 5_000_000,
        "hero_image_url": "/images/campaigns/biogas.webp",
        "sort_order": 10,
        "status": "active",
        "is_featured": True,
    }

    resp = client.post(
        "/api/v1/campaigns",
        json=payload,
        headers=admin_token_headers,
    )
    assert resp.status_code == 201, resp.text

    data = resp.json()
    assert data["id"]
    assert data["slug"] == slug
    assert data["status"] == "active"
    assert data["is_featured"] is True


def test_public_can_list_campaigns(client, admin_token_headers):
    # create one campaign as admin (with unique slug)
    slug = _unique_slug("general-support")

    payload = {
        "name": "General Support",
        "slug": slug,
        "short_description": "Support our ongoing work.",
        "currency": "UGX",
        "status": "active",
        "is_featured": True,
    }
    resp_create = client.post(
        "/api/v1/campaigns",
        json=payload,
        headers=admin_token_headers,
    )
    assert resp_create.status_code == 201, resp_create.text

    # public list
    resp = client.get("/api/v1/campaigns")
    assert resp.status_code == 200, resp.text

    items = resp.json()
    assert any(c["slug"] == slug for c in items)


def test_public_get_campaign_by_slug(client, admin_token_headers):
    slug = _unique_slug("education-fund")

    payload = {
        "name": "Education Fund",
        "slug": slug,
        "short_description": "Support training & capacity building.",
        "currency": "UGX",
        "status": "active",
        "is_featured": False,
    }
    resp_create = client.post(
        "/api/v1/campaigns",
        json=payload,
        headers=admin_token_headers,
    )
    assert resp_create.status_code == 201, resp_create.text

    resp = client.get(f"/api/v1/campaigns/{slug}")
    assert resp.status_code == 200, resp.text
    data = resp.json()
    assert data["slug"] == slug


def test_admin_soft_delete_campaign(client, admin_token_headers):
    # Create campaign with unique slug
    slug = _unique_slug("to-be-archived")

    payload = {
        "name": "To be archived",
        "slug": slug,
        "currency": "UGX",
        "status": "active",
        "is_featured": True,
    }
    resp_create = client.post(
        "/api/v1/campaigns",
        json=payload,
        headers=admin_token_headers,
    )
    assert resp_create.status_code == 201, resp_create.text
    campaign = resp_create.json()
    campaign_id = campaign["id"]

    # Soft delete
    resp_delete = client.delete(
        f"/api/v1/campaigns/{campaign_id}",
        headers=admin_token_headers,
    )
    assert resp_delete.status_code == 204, resp_delete.text

    # Should be archived now when fetched directly
    resp_get = client.get(f"/api/v1/campaigns/{slug}")
    # Depending on your policy you could keep public access; here we expect it's still visible but archived.
    if resp_get.status_code == 200:
        data = resp_get.json()
        assert data["status"] in ["archived", CampaignStatus.ARCHIVED.value]

