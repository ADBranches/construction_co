# backend/tests/test_subscribers_admin.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import UserRole
from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.models.subscriber import Subscriber

client = TestClient(app)


def setup_module():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed admin (idempotent)
    admin_in = UserCreate(
        email="admin@subs.com",
        full_name="Subs Admin",
        password="adminpass",
        role=UserRole.ADMIN,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, admin_in)

    # Seed a subscriber if not present
    existing = (
        db.query(Subscriber)
        .filter(Subscriber.email == "client@newsletter.com")
        .first()
    )
    if existing is None:
        s = Subscriber(email="client@newsletter.com")
        db.add(s)
        db.commit()

    db.close()


def login():
    resp = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@subs.com", "password": "adminpass"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_admin_can_list_subscribers():
    token = login()
    resp = client.get(
        "/api/v1/subscribers",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert any(item["email"] == "client@newsletter.com" for item in data)


def test_anonymous_cannot_list_subscribers():
    resp = client.get("/api/v1/subscribers")
    assert resp.status_code in (401, 403)
