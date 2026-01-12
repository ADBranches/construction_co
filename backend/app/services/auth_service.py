from datetime import timedelta
from typing import Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt_handler import create_access_token


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_in: UserCreate, is_superuser: bool = False) -> User:
    """
    Create a new user (admin). Use this via a seed script or internal admin.
    """
    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password),
        is_active=True,
        is_superuser=is_superuser,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user


def create_login_token(user: User, expires_delta: Optional[timedelta] = None) -> str:
    """
    High-level token factory for login, wrapping JWT creation.
    """
    return create_access_token(subject=user.id, expires_delta=expires_delta)
