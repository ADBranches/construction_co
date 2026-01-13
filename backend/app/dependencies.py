# backend/app/dependencies.py
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.services.auth_service import (
    get_user_by_id,
    get_user_by_email,
)
from app.utils.jwt_handler import decode_token

# NOTE: main includes this router under /api/v1, so final token URL is /api/v1/auth/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)  # should return a dict-like payload
    except JWTError:
        raise credentials_exception

    user: User | None = None

    # 1) Preferred: email-based lookup (matches create_login_token)
    email = payload.get("email")
    if email:
        user = get_user_by_email(db, email=email)
    else:
        # 2) Backwards-compatible fallback: use `sub` as UUID user_id
        sub = payload.get("sub")
        if not sub:
            raise credentials_exception

        try:
            user_id = uuid.UUID(sub)
        except ValueError:
            raise credentials_exception

        user = get_user_by_id(db, user_id=user_id)

    if user is None or not user.is_active:
        raise credentials_exception

    return user


def require_role(allowed_roles: list[UserRole | str]):
    """
    Dependency factory: require user to have one of allowed_roles (or be is_superuser).
    """
    def _wrapper(current_user: User = Depends(get_current_user)) -> User:
        role_value = (
            current_user.role.value
            if isinstance(current_user.role, UserRole)
            else str(current_user.role)
        )
        allowed = [
            r.value if isinstance(r, UserRole) else str(r)
            for r in allowed_roles
        ]
        if role_value not in allowed and not current_user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions.",
            )
        return current_user

    return _wrapper


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Backwards-compatible admin check: role=admin OR is_superuser.
    """
    role_value = (
        current_user.role.value
        if isinstance(current_user.role, UserRole)
        else str(current_user.role)
    )

    if role_value != UserRole.ADMIN.value and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions.",
        )
    return current_user
