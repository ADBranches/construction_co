from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(UserBase):
    password: str  # plain text, will be hashed in service layer


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None
    password: str | None = None  # optional password change


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
