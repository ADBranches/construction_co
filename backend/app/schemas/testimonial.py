# app/schemas/testimonial.py
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class TestimonialBase(BaseModel):
    name: str = Field(..., max_length=255)
    role: str | None = Field(None, max_length=255)
    company: str | None = Field(None, max_length=255)
    quote: str
    is_featured: bool = True
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    name: str | None = Field(None, max_length=255)
    role: str | None = Field(None, max_length=255)
    company: str | None = Field(None, max_length=255)
    quote: str | None = None
    is_featured: bool | None = None
    is_active: bool | None = None


class TestimonialOut(TestimonialBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # if you’re on Pydantic v1, change to orm_mode = True
