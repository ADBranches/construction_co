from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserOut
from app.services.auth_service import authenticate_user, create_login_token

settings = get_settings()

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    """
    Admin login endpoint.

    Accepts: username (email) + password via form-data (OAuth2 spec style).
    Returns: JWT access token.
    """
    user = authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Optional: allow override via env later
    access_token_expires = timedelta(minutes=60)
    token = create_login_token(user, expires_delta=access_token_expires)

    return Token(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)) -> UserOut:
    """
    Get currently authenticated user.
    """
    return current_user
