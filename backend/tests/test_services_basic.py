# backend/tests/test_services_basic.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, SessionLocal
from app.schemas.user import UserCreate
from app.models.user import UserRole
from app.services.auth_service import create_user

client = TestClient(app)


def setup_module():
    """
    Make tests deterministic by resetting the schema before this module runs.
    This avoids leftover services/users from previous runs causing uniques to fail.
    """
    # Drop and recreate all tables for a clean slate
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    admin = UserCreate(
        email="admin@svc.com",
        full_name="Admin",
        password="adminpass",
        role=UserRole.ADMIN,
    )
    create_user(db, admin)

    db.close()


def login():
    resp = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@svc.com", "password": "adminpass"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    return resp.json()["access_token"]


def test_create_service():
    token = login()
    payload = {
        "name": "Test Service",
        "slug": "test-service",
        "short_description": "Short",
        "description": "Desc",
        "display_order": 0,
        "is_active": True,
    }
    resp = client.post(
        "/api/v1/services",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["slug"] == "test-service"


def test_update_service():
    token = login()

    # Get created service
    resp_list = client.get("/api/v1/services")
    service_id = resp_list.json()[0]["id"]

    resp = client.put(
        f"/api/v1/services/{service_id}",
        json={"name": "Updated"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "Updated"


def test_delete_service():
    token = login()

    # Get created service
    resp_list = client.get("/api/v1/services")
    service_id = resp_list.json()[0]["id"]

    resp = client.delete(
        f"/api/v1/services/{service_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 204
