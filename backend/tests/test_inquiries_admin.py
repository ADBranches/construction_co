# backend/tests/test_inquiries_admin.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import UserRole
from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.models.inquiry import Inquiry, InquiryStatus

client = TestClient(app)


def setup_module():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed admin (idempotent via create_user)
    admin_in = UserCreate(
        email="admin@inquiries.com",
        full_name="Inquiries Admin",
        password="adminpass",
        role=UserRole.ADMIN,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, admin_in)

    # Seed a couple of inquiries if not already there
    existing = (
        db.query(Inquiry)
        .filter(Inquiry.email == "client1@example.com")
        .first()
    )
    if existing is None:
        i1 = Inquiry(
            full_name="Client One",
            email="client1@example.com",
            message="Need a biogas system",
            status=InquiryStatus.NEW,
            source="quote",
        )
        i2 = Inquiry(
            full_name="Client Two",
            email="client2@example.com",
            message="Construction project",
            status=InquiryStatus.IN_REVIEW,
            source="contact",
        )
        db.add_all([i1, i2])
        db.commit()

    db.close()


def login():
    resp = client.post(
        "/api/v1/auth/login",
        data={
            "username": "admin@inquiries.com",
            "password": "adminpass",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_admin_can_list_inquiries():
    token = login()
    resp = client.get(
        "/api/v1/inquiries",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 2


def test_filter_by_status():
    token = login()
    resp = client.get(
        "/api/v1/inquiries",
        params={"status": InquiryStatus.NEW.value},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert all(item["status"] == InquiryStatus.NEW.value for item in data)


def test_can_update_status_via_patch():
    token = login()
    list_resp = client.get(
        "/api/v1/inquiries",
        headers={"Authorization": f"Bearer {token}"},
    )
    first_id = list_resp.json()[0]["id"]

    resp = client.patch(
        f"/api/v1/inquiries/{first_id}/status",
        params={"status": InquiryStatus.QUOTED.value},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == InquiryStatus.QUOTED.value


def test_can_add_internal_notes_via_put():
    token = login()
    list_resp = client.get(
        "/api/v1/inquiries",
        headers={"Authorization": f"Bearer {token}"},
    )
    first_id = list_resp.json()[0]["id"]

    payload = {"internal_notes": "Called client, waiting on feedback."}
    resp = client.put(
        f"/api/v1/inquiries/{first_id}",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["internal_notes"] == payload["internal_notes"]

