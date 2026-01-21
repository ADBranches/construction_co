# app/schemas/user.py
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.user import UserRole


class UserBase(BaseModel):
    """
    Base fields shared across user schemas.
    """
    email: EmailStr
    full_name: str | None = None
    role: UserRole = UserRole.STAFF
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(UserBase):
    """
    Used for seeding and /auth/users admin creation.

    Tests currently rely on:
    - email
    - full_name
    - password
    - role
    - is_active
    - is_superuser
    """
    password: str  # plain text, hashed in the service layer


class UserUpdate(BaseModel):
    """
    Generic update payload (not role-specific).
    """
    email: EmailStr | None = None
    full_name: str | None = None
    role: UserRole | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None
    password: str | None = None  # optional password change


class UserUpdateRole(BaseModel):
    """
    Payload for admin to promote/demote users.

    - role: "admin" | "staff" (or None to keep current)
    - is_superuser: optional toggle
    - is_active: optional (for future suspend/activate)
    """
    role: UserRole | str | None = None
    is_superuser: bool | None = None
    is_active: bool | None = None


class UserOut(UserBase):
    """
    Read model returned to clients (auth.me, users list, etc.).
    """
    id: UUID
    created_at: datetime
    updated_at: datetime

    # Make it work directly with SQLAlchemy ORM objects
    model_config = ConfigDict(from_attributes=True)
