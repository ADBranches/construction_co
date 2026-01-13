# backend/tests/test_stats_endpoints.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal, Base, engine
from app.models.user import UserRole
from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.models.project import Project, ProjectStatus
from app.models.inquiry import Inquiry, InquiryStatus

client = TestClient(app)


def setup_module():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ---------- Seed admin (idempotent via create_user) ----------
    admin_in = UserCreate(
        email="admin@stats.com",
        full_name="Stats Admin",
        password="adminpass",
        role=UserRole.ADMIN,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, admin_in)

    # ---------- Seed project (idempotent) ----------
    project_slug = "stats-project"
    existing_project = (
        db.query(Project)
        .filter(Project.slug == project_slug)
        .first()
    )

    if existing_project is None:
        p = Project(
            name="Stats Project",
            slug=project_slug,
            status=ProjectStatus.ONGOING,
            is_featured=True,
        )
        db.add(p)

    # ---------- Seed inquiry (idempotent) ----------
    existing_inquiry = (
        db.query(Inquiry)
        .filter(
            Inquiry.email == "client@example.com",
            Inquiry.message == "Test",
        )
        .first()
    )

    if existing_inquiry is None:
        i = Inquiry(
            full_name="Stats Client",
            email="client@example.com",
            message="Test",
            status=InquiryStatus.NEW,
        )
        db.add(i)

    db.commit()
    db.close()


def login():
    resp = client.post(
        "/api/v1/auth/login",
        data={
            "username": "admin@stats.com",
            "password": "adminpass",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_project_stats():
    token = login()
    resp = client.get(
        "/api/v1/projects/stats",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 1


def test_inquiry_stats():
    token = login()
    resp = client.get(
        "/api/v1/inquiries/stats",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] >= 1
