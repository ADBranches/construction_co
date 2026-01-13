# backend/app/utils/jwt_handler.py
from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Dict

from jose import JWTError, jwt

from app.config import get_settings

settings = get_settings()

# You can later move this to env if you want:
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a signed JWT access token.

    `data` is a dict that will be encoded into the token payload.
    For example:
        {
            "sub": "<user_id>",
            "email": "admin@example.com",
            "role": "admin",
            "is_superuser": False,
        }
    """
    to_encode = data.copy()

    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    now = datetime.now(timezone.utc)
    expire = now + expires_delta

    # Add issued-at and expiry
    to_encode.update(
        {
            "iat": now.timestamp(),
            "exp": expire,
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt


def decode_token(token: str) -> dict[str, Any]:
    """
    Decode a JWT token and return its payload.

    Raises JWTError if token is invalid/expired.
    """
    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )
    return payload
