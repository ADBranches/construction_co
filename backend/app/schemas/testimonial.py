# app/schemas/testimonial.py
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class TestimonialBase(BaseModel):
    # API contract fields (match tests + model attributes)
    client_name: str = Field(..., max_length=255)
    client_role: str | None = Field(None, max_length=255)
    company: str | None = Field(None, max_length=255)
    message: str
    rating: int | None = None

    is_featured: bool = True
    is_active: bool = True
    display_order: int = 0


class TestimonialCreate(TestimonialBase):
    """Payload for creating a testimonial (admin)."""
    pass


class TestimonialUpdate(BaseModel):
    """Partial update (if/when you need it)."""
    client_name: str | None = Field(None, max_length=255)
    client_role: str | None = Field(None, max_length=255)
    company: str | None = Field(None, max_length=255)
    message: str | None = None
    rating: int | None = None
    is_featured: bool | None = None
    is_active: bool | None = None
    display_order: int | None = None


class TestimonialOut(TestimonialBase):
    """Response model."""
    id: UUID
    created_at: datetime
    updated_at: datetime

    # Tell Pydantic v2 this comes from SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)
