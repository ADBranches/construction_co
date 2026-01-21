from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    name: str
    slug: str
    short_description: str | None = None
    description: str | None = None
    # New optional marketing fields (match model.Service)
    tagline: str | None = None
    category: str | None = None
    hero_image_url: str | None = None
    icon: str | None = None
    highlight_1: str | None = None
    highlight_2: str | None = None
    highlight_3: str | None = None

    is_active: bool = True
    display_order: int = 0
    is_active: bool = True
    display_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    short_description: str | None = None
    description: str | None = None
    # New optional marketing fields for partial updates
    tagline: str | None = None
    category: str | None = None
    hero_image_url: str | None = None
    icon: str | None = None
    highlight_1: str | None = None
    highlight_2: str | None = None
    highlight_3: str | None = None

    is_active: bool | None = None
    display_order: int | None = None
    is_active: bool | None = None
    display_order: int | None = None


class ServiceOut(ServiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
