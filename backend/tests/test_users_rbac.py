# backend/tests/test_users_rbac.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import User, UserRole
from app.schemas.user import UserCreate
from app.services.auth_service import create_user


client = TestClient(app)


def setup_module():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Admin user (idempotent via create_user)
    admin_in = UserCreate(
        email="admin@users.com",
        full_name="Users Admin",
        password="adminpass",
        role=UserRole.ADMIN,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, admin_in)

    # Staff user
    staff_in = UserCreate(
        email="staff@users.com",
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


def test_admin_can_list_users():
    token = login("admin@users.com", "adminpass")
    resp = client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    emails = {u["email"] for u in data}
    assert "admin@users.com" in emails
    assert "staff@users.com" in emails


def test_staff_cannot_list_users():
    token = login("staff@users.com", "staffpass")
    resp = client.get(
        "/api/v1/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403


def test_admin_can_promote_staff_to_admin():
    token = login("admin@users.com", "adminpass")

    # Look up staff user ID directly
    db = SessionLocal()
    staff = db.query(User).filter(User.email == "staff@users.com").first()
    db.close()
    assert staff is not None

    resp = client.patch(
        f"/api/v1/users/{staff.id}/role",
        json={"role": "admin", "is_superuser": False},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "staff@users.com"
    assert data["role"] == "admin"


def test_staff_cannot_promote_anyone():
    token = login("staff@users.com", "staffpass")

    # Just attempt to patch some bogus id (RBAC check triggers before 404)
    resp = client.patch(
        "/api/v1/users/00000000-0000-0000-0000-000000000000/role",
        json={"role": "admin"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 403

