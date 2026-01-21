# backend/tests/test_testimonials_basic.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import UserRole
from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.models.testimonial import Testimonial


client = TestClient(app)


def setup_module():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed admin (idempotent)
    admin_in = UserCreate(
        email="admin@testimonials.com",
        full_name="Testimonials Admin",
        password="adminpass",
        role=UserRole.ADMIN,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, admin_in)

    # Seed one active testimonial if none exists
    existing = (
        db.query(Testimonial)
        .filter(Testimonial.client_name == "Seed Client")
        .first()
    )
    if existing is None:
        t = Testimonial(
            client_name="Seed Client",
            client_role="Farm Owner",
            company="Brisk Farm Pilot",
            message="Great engineering support on our biogas system.",
            rating=5,
            is_active=True,
            is_featured=True,
            display_order=1,
        )
        db.add(t)
        db.commit()

    db.close()


def login():
    resp = client.post(
        "/api/v1/auth/login",
        data={
            "username": "admin@testimonials.com",
            "password": "adminpass",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_public_can_list_active_testimonials():
    resp = client.get("/api/v1/testimonials")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert any(item["client_name"] == "Seed Client" for item in data)


def test_filter_by_featured():
    resp = client.get("/api/v1/testimonials", params={"is_featured": True})
    assert resp.status_code == 200
    data = resp.json()
    # All returned must be featured
    assert all(item["is_featured"] is True for item in data)


def test_admin_can_create_testimonial():
    token = login()
    payload = {
        "client_name": "Happy Client",
        "client_role": "Livestock Farmer",
        "company": "Western Hills Farm",
        "message": "Brisk transformed our waste system into energy.",
        "rating": 5,
        "is_active": True,
        "is_featured": False,
        "display_order": 2,
    }
    resp = client.post(
        "/api/v1/testimonials",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["client_name"] == payload["client_name"]
    assert data["is_active"] is True


def test_anonymous_cannot_create_testimonial():
    payload = {
        "client_name": "Bad",
        "message": "Should not be created.",
    }
    resp = client.post("/api/v1/testimonials", json=payload)
    assert resp.status_code in (401, 403)

