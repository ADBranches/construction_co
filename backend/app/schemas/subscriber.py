# app/schemas/subscriber.py
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class SubscriberCreate(BaseModel):
    email: EmailStr


class SubscriberOut(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True  # or orm_mode = True for Pydantic v1
