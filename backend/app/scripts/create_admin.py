# backend/app/scripts/create_admin.py

from app.database import SessionLocal
from app.models.user import User
from app.services.auth_service import create_user
from app.schemas.user import UserCreate


def ensure_user(
    db,
    email: str,
    password: str,
    full_name: str,
    *,
    is_superuser: bool = False,
):
    """Create the user if missing; if it exists, keep it but sync superuser flag."""
    user = db.query(User).filter(User.email == email).first()

    if user:
        # Keep existing password hash – just make sure flags are correct
        user.is_superuser = is_superuser
        user.is_active = True
        print(f"✅ Existing user kept: {email} (superuser={is_superuser})")
        return user

    # Create fresh user via your existing service (handles hashing etc.)
    user_in = UserCreate(
        email=email,
        full_name=full_name,
        password=password,
    )

    user = create_user(db, user_in, is_superuser=is_superuser)
    print(f"✅ Created new user: {email} (superuser={is_superuser})")
    return user


def main():
    db = SessionLocal()
    try:
        # Main admin used in tests + UI
        ensure_user(
            db,
            email="admin@example.com",
            password="adminpass",
            full_name="Admin Example",
            is_superuser=True,
        )

        # Staff (non-admin) from tests
        ensure_user(
            db,
            email="staff@example.com",
            password="staffpass",
            full_name="Staff Example",
            is_superuser=False,
        )

        # Extra admins from your test suite
        ensure_user(
            db,
            email="admin@stats.com",
            password="adminpass",
            full_name="Stats Admin",
            is_superuser=True,
        )
        ensure_user(
            db,
            email="admin@subs.com",
            password="adminpass",
            full_name="Subscribers Admin",
            is_superuser=True,
        )
        ensure_user(
            db,
            email="admin@users.com",
            password="adminpass",
            full_name="Users Admin",
            is_superuser=True,
        )
        ensure_user(
            db,
            email="staff@users.com",
            password="staffpass",
            full_name="Users Staff",
            is_superuser=False,
        )

        db.commit()
        print("🎯 Dev users synced successfully.")
    except Exception as e:
        db.rollback()
        print("❌ Error while seeding dev users:", e)
    finally:
        db.close()


if __name__ == "__main__":
    main()
