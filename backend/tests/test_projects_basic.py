# backend/tests/test_projects_basic.py
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, engine, SessionLocal
from app.models.user import UserRole
from app.schemas.user import UserCreate
from app.services.auth_service import create_user
from app.models.project import ProjectStatus

client = TestClient(app)


def setup_module():
    # -----------------------------------------
    # 🔹 Rebuild test DB schema from scratch
    # -----------------------------------------
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # -----------------------------------------
    # 🔹 Seed admin user for project tests
    # -----------------------------------------
    admin = UserCreate(
        email="admin@projects.com",
        full_name="Projects Admin",
        password="adminpass",
        role=UserRole.ADMIN,
        is_active=True,
        is_superuser=False,
    )
    create_user(db, admin)

    db.close()

def login():
    resp = client.post(
        "/api/v1/auth/login",
        data={"username": "admin@projects.com", "password": "adminpass"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    return resp.json()["access_token"]


def test_admin_can_create_project():
    token = login()
    payload = {
      "name": "Demo Project",
      "slug": "demo-project",
      "location": "Kampala",
      "client_name": "Client X",
      "budget": "50M UGX",
      "status": ProjectStatus.ONGOING.value,
      "is_featured": True,
      "short_description": "Short desc",
      "description": "Full project description",
    }

    resp = client.post(
        "/api/v1/projects",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["slug"] == "demo-project"
    assert data["status"] == ProjectStatus.ONGOING.value

def test_public_can_list_projects():
    resp = client.get("/api/v1/projects")
    assert resp.status_code == 200

    data = resp.json()
    assert isinstance(data, dict)
    assert "items" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) >= 1

def test_public_can_get_project_by_slug():
    resp = client.get("/api/v1/projects/demo-project")
    assert resp.status_code == 200
    data = resp.json()
    assert data["slug"] == "demo-project"


def test_admin_can_update_project():
    token = login()

    # get first project
    list_resp = client.get("/api/v1/projects")
    data = list_resp.json()
    assert "items" in data
    assert len(data["items"]) >= 1
    project_id = data["items"][0]["id"]


    resp = client.put(
        f"/api/v1/projects/{project_id}",
        json={"location": "Mbarara"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["location"] == "Mbarara"


def test_admin_can_delete_project():
    token = login()

    list_resp = client.get("/api/v1/projects")
    data = list_resp.json()
    assert "items" in data
    assert len(data["items"]) >= 1
    project_id = data["items"][0]["id"]


    resp = client.delete(
        f"/api/v1/projects/{project_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 204

