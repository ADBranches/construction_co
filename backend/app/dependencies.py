# backend/app/dependencies.py
import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import get_db  # <— re-exported here
from app.models.user import User
from app.schemas.auth import TokenPayload
from app.services.auth_service import get_user_by_id
from app.utils.jwt_handler import decode_token

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
        payload = decode_token(token)
        token_data = TokenPayload(**payload)
    except (JWTError, ValueError):
        raise credentials_exception

    if not token_data.sub:
        raise credentials_exception

    try:
        user_id = uuid.UUID(token_data.sub)
    except ValueError:
        raise credentials_exception

    user = get_user_by_id(db, user_id=user_id)
    if user is None or not user.is_active:
        raise credentials_exception

    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions.",
        )
    return current_user
