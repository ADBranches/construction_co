# app/schemas/project.py
from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.project import ProjectStatus
from .service import ServiceOut
from .media import MediaOut


class ProjectBase(BaseModel):
    """
    Core project fields shared across create/update/output.

    Harmonized between:
    - original schema (budget_amount, dates, cover_image_url, etc.)
    - CMS spec (short_description, hero_image_url, budget as string).
    """

    name: str
    slug: str

    # Descriptions
    description: str | None = None
    short_description: str | None = None  # brief marketing copy

    # Context
    location: str | None = None
    client_name: str | None = None

    # Budget (both numeric & human-readable)
    budget_amount: float | None = None  # numeric, useful for stats
    budget: str | None = None  # human-readable string ("UGX 20M", etc.)

    # Timeline
    start_date: date | None = None
    end_date: date | None = None

    # Status / flags
    status: ProjectStatus = ProjectStatus.ONGOING
    is_featured: bool = False

    # Images
    cover_image_url: str | None = None  # legacy/main image
    hero_image_url: str | None = None  # full-width hero image for detail pages

    # Relations
    service_id: UUID | None = None  # optional relation to Service


class ProjectCreate(ProjectBase):
    """
    Payload for creating a new project.
    """
    pass


class ProjectUpdate(BaseModel):
    """
    Partial update payload – all fields optional.
    Mirrors ProjectBase but optional for PATCH/PUT semantics.
    """

    name: str | None = None
    slug: str | None = None

    # Descriptions
    description: str | None = None
    short_description: str | None = None

    # Context
    location: str | None = None
    client_name: str | None = None

    # Budget
    budget_amount: float | None = None
    budget: str | None = None

    # Timeline
    start_date: date | None = None
    end_date: date | None = None

    # Status / flags
    status: ProjectStatus | None = None
    is_featured: bool | None = None

    # Images
    cover_image_url: str | None = None
    hero_image_url: str | None = None

    # Relations
    service_id: UUID | None = None


class ProjectBrief(BaseModel):
    """
    Lightweight projection for listings (cards, grids, etc.).
    """
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    location: str | None = None
    status: ProjectStatus
    is_featured: bool
    cover_image_url: str | None = None
    hero_image_url: str | None = None  # optional for richer cards
    short_description: str | None = None


class ProjectOut(ProjectBase):
    """
    Full project representation for detail views & admin.
    Includes nested relations.
    """
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime

    # Optional nested data for richer detail views
    service: ServiceOut | None = None
    media_items: list[MediaOut] = []


class ProjectListOut(BaseModel):
    """
    Wrapper for paginated project listings.
    """
    model_config = ConfigDict(from_attributes=True)

    total: int
    page: int
    limit: int
    items: list[ProjectBrief]
