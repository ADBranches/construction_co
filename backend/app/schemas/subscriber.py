# app/schemas/subscriber.py
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict


class SubscriberCreate(BaseModel):
    email: EmailStr


class SubscriberOut(BaseModel):
    id: UUID
    email: EmailStr
    created_at: datetime

    # ✅ Pydantic v2-style config
    model_config = ConfigDict(from_attributes=True)

