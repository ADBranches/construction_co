# backend/conftest.py
import os
import sys

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.utils.hashing import hash_password  # ✅ use the real helper

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

# Ensure the backend root (this directory) is on sys.path
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)


@pytest.fixture(scope="session")
def client():
    """
    Shared FastAPI TestClient for API tests.
    """
    with TestClient(app) as c:
        yield c


def _ensure_admin_user():
    """
    Make sure there is at least one admin user in the test DB.
    Returns (email, plain_password) used for login.
    """
    email = "admin@example.com"
    password = "Admin123!"

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                email=email,
                hashed_password=hash_password(password),  # ✅ from app.utils.hashing
                role=UserRole.ADMIN,
                is_active=True,
            )
            db.add(user)
            db.commit()
        return email, password
    finally:
        db.close()


@pytest.fixture
def admin_token_headers(client):
    """
    Returns Authorization headers for an admin user.
    Uses the normal login endpoint to get a JWT.
    """
    email, password = _ensure_admin_user()

    resp = client.post(
        "/api/v1/auth/login",
        data={
            "username": email,   
            "password": password,},
    )
    assert resp.status_code == 200, resp.text


    data = resp.json()
    token = data["access_token"]
    return {"Authorization": f"Bearer {token}"}
