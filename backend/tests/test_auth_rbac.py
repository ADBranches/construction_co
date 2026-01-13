# backend/tests/test_auth_rbac.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import UserRole
from app.schemas.user import UserCreate
from app.services.auth_service import create_user


client = TestClient(app)


def setup_module():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed admin
    admin_in = UserCreate(
        email="admin@example.com",
        full_name="Admin User",
        password="adminpass",
        role=UserRole.ADMIN,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, admin_in)

    # Seed staff
    staff_in = UserCreate(
        email="staff@example.com",
        full_name="Staff User",
        password="staffpass",
        role=UserRole.STAFF,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, staff_in)

    db.close()


def login(email, password):
    resp = client.post(
        "/api/v1/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_auth_me_includes_role():
    token = login("admin@example.com", "adminpass")
    resp = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "admin"


def test_admin_can_create_staff_user():
    token = login("admin@example.com", "adminpass")
    payload = {
        "email": "newstaff@example.com",
        "full_name": "New Staff",
        "password": "newpass",
        "role": "staff",
    }
    resp = client.post(
        "/api/v1/auth/users",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == payload["email"]
    assert data["role"] == "staff"


def test_staff_cannot_create_users():
    token = login("staff@example.com", "staffpass")
    payload = {
        "email": "badcreate@example.com",
        "full_name": "Bad",
        "password": "badpass",
        "role": "staff",
    }
    resp = client.post(
        "/api/v1/auth/users",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403


def test_staff_cannot_create_service():
    # Prove RBAC enforcement on a real admin-only route
    token = login("staff@example.com", "staffpass")
    payload = {
        "name": "RBAC Protected Service",
        "slug": "rbac-protected-service",
        "short_description": "Test",
        "description": "Test",
        "is_active": True,
        "display_order": 0,
    }
    resp = client.post(
        "/api/v1/services",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403
