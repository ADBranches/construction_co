# backend/app/api/v1/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.schemas.auth import Token
from app.schemas.user import UserOut, UserCreate
from app.services.auth_service import (
    authenticate_user,
    create_login_token,
    get_user_by_email,
    create_user as service_create_user,
)

settings = get_settings()

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> Token:
    """
    Authenticate user using email + password and return a JWT access token.

    OAuth2PasswordRequestForm sends the identifier as `username`,
    but in our case we use the email address as the username.
    """
    user = authenticate_user(
        db,
        email=form_data.username,
        password=form_data.password,
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_login_token(user)

    return Token(
        access_token=access_token,
        token_type="bearer",
    )


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)) -> UserOut:
    """
    Get currently authenticated user.
    """
    return UserOut.model_validate(current_user)


@router.post("/users", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
) -> UserOut:
    """
    Admin: create staff/admin users.

    Uses the service layer, which is idempotent:
    - If the email is new → creates the user.
    - If the email exists → updates that user.
    This keeps tests and seeding stable across repeated runs.
    """
    # Let the service handle "exists vs create" logic
    user = service_create_user(db, user_in)
    return UserOut.model_validate(user)
