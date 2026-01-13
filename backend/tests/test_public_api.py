# backend/tests/test_public_api.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal, Base, engine
from app.models import Service, Project
from app.models.project import ProjectStatus

client = TestClient(app)


def setup_module():
    # Ensure schema exists for tests
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # ---- Service seed (idempotent) ----
    service = db.query(Service).filter(Service.slug == "biogas-systems").first()
    if not service:
        service = Service(
            name="Biogas Systems",
            slug="biogas-systems",
            short_description="Biogas digesters for farms and homes.",
        )
        db.add(service)
        db.commit()
        db.refresh(service)

    # ---- Project seed (idempotent) ----
    project = db.query(Project).filter(Project.slug == "pilot-biogas-plant").first()
    if not project:
        project = Project(
            name="Pilot Biogas Plant",
            slug="pilot-biogas-plant",
            status=ProjectStatus.COMPLETED,
            service_id=service.id,
        )
        db.add(project)
        db.commit()

    db.close()


def teardown_module():
    # Optional: if you ever switch to a dedicated test DB, you can wipe it here:
    # Base.metadata.drop_all(bind=engine)
    pass


def test_get_services_returns_list():
    resp = client.get("/api/v1/services")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "name" in data[0]
    assert "slug" in data[0]


def test_get_projects_returns_items_payload():
    resp = client.get("/api/v1/projects")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    assert "items" in data
    assert isinstance(data["items"], list)
    if data["items"]:
        project = data["items"][0]
        assert "id" in project
        assert "name" in project
        assert "status" in project


def test_submit_inquiry_valid():
    payload = {
        "full_name": "Test Client",
        "email": "client@example.com",
        "message": "I need a biogas system.",
    }
    resp = client.post("/api/v1/inquiries", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["full_name"] == payload["full_name"]
    assert data["email"] == payload["email"]
    assert data["status"]  # should be NEW by default


def test_submit_inquiry_invalid_email():
    payload = {
        "full_name": "Bad Email Client",
        "email": "not-an-email",
    }
    resp = client.post("/api/v1/inquiries", json=payload)
    # Pydantic EmailStr should trigger 422 validation error
    assert resp.status_code == 422
