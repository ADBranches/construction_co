# backend/app/scripts/create_admin.py

import sys
from app.database import SessionLocal
from app.services.auth_service import create_user
from app.schemas.user import UserCreate

def main():
    db = SessionLocal()

    admin_data = UserCreate(
        email="admin@example.com",
        full_name="Administrator",
        password="StrongPass123!"
    )

    try:
        admin = create_user(db, admin_data, is_superuser=True)
        print("Admin user created:")
        print("ID:", admin.id)
        print("Email:", admin.email)
    except Exception as e:
        print("Error creating admin:", e)
    finally:
        db.close()


if __name__ == "__main__":
    main()
