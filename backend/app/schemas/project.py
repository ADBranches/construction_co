# app/schemas/project.py
from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from app.models.project import ProjectStatus
from .service import ServiceOut
from .media import MediaOut


# =====================================================
# BASE MODEL (Shared fields)
# =====================================================
class ProjectBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    slug: str

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

    # Status & flags
    status: ProjectStatus = ProjectStatus.ONGOING
    is_featured: bool = False

    # Images
    cover_image_url: str | None = None
    hero_image_url: str | None = None
    thumbnail: str | None = None

    # Card metadata
    type: str | None = None
    technologies: list[str] | None = None
    size: str | None = None

    # Relations
    service_id: UUID | None = None


# =====================================================
# CREATE
# =====================================================
class ProjectCreate(ProjectBase):
    pass


# =====================================================
# UPDATE (all optional)
# =====================================================
class ProjectUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str | None = None
    slug: str | None = None

    description: str | None = None
    short_description: str | None = None

    location: str | None = None
    client_name: str | None = None

    budget_amount: float | None = None
    budget: str | None = None

    start_date: date | None = None
    end_date: date | None = None

    status: ProjectStatus | None = None
    is_featured: bool | None = None

    cover_image_url: str | None = None
    hero_image_url: str | None = None
    thumbnail: str | None = None

    type: str | None = None
    technologies: list[str] | None = None
    size: str | None = None

    service_id: UUID | None = None


# =====================================================
# LIST ITEM (used in lists)
# =====================================================
class ProjectBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    location: str | None = None
    status: ProjectStatus
    is_featured: bool

    # Useful for listings
    thumbnail: str | None = None
    cover_image_url: str | None = None
    hero_image_url: str | None = None
    short_description: str | None = None

    type: str | None = None
    size: str | None = None


# =====================================================
# FULL OUTPUT
# =====================================================
class ProjectOut(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime

    service: ServiceOut | None = None
    media_items: list[MediaOut] = []


# =====================================================
# PAGINATED LIST WRAPPER
# =====================================================
class ProjectListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total: int
    page: int
    limit: int
    items: list[ProjectBrief]

