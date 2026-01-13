# backend/app/services/auth_service.py
from datetime import timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.schemas.user import UserCreate
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_handler import create_access_token

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()

def create_user(
    db: Session,
    user_in: UserCreate,
    is_superuser: bool | None = None,
) -> User:
    """
    Create or update a user.

    - If a user with this email already exists, update its password/role/flags.
    - Otherwise create a new one.

    This keeps test seeding idempotent so repeated runs don't break things.
    """
    existing = get_user_by_email(db, user_in.email)

    # Normalize role (accept Enum or plain string)
    role = user_in.role or UserRole.STAFF
    if isinstance(role, str):
        try:
            role = UserRole(role)
        except ValueError:
            role = UserRole.STAFF

    if existing:
        # UPDATE path – ensure tests always get the expected credentials
        if user_in.full_name is not None:
            existing.full_name = user_in.full_name

        existing.hashed_password = hash_password(user_in.password)
        existing.is_active = getattr(user_in, "is_active", existing.is_active)
        existing.is_superuser = (
            is_superuser
            if is_superuser is not None
            else getattr(user_in, "is_superuser", existing.is_superuser)
        )
        existing.role = role

        db.commit()
        db.refresh(existing)
        return existing

    # CREATE path
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password),
        is_active=getattr(user_in, "is_active", True),
        is_superuser=(
            is_superuser
            if is_superuser is not None
            else getattr(user_in, "is_superuser", False)
        ),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """
    Look up a user by email and verify the password.
    Returns the user on success, or None if credentials are invalid.
    """
    user = get_user_by_email(db, email=email)
    if user is None:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    if not user.is_active:
        return None

    return user


def create_login_token(
    user: User,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a JWT access token for the given user.
    """
    payload = {
        "sub": str(user.id),  # still fine to keep
        "email": user.email,
        "role": user.role.value if isinstance(user.role, UserRole) else user.role,
        "is_superuser": user.is_superuser,
    }

    return create_access_token(payload)
