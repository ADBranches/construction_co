from datetime import datetime, date
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.project import ProjectStatus  # or from ..models.project import ProjectStatus
from .service import ServiceOut
from .media import MediaOut


class ProjectBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    location: str | None = None
    client_name: str | None = None
    budget_amount: float | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: ProjectStatus = ProjectStatus.ONGOING
    is_featured: bool = False
    cover_image_url: str | None = None
    service_id: UUID | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    location: str | None = None
    client_name: str | None = None
    budget_amount: float | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: ProjectStatus | None = None
    is_featured: bool | None = None
    cover_image_url: str | None = None
    service_id: UUID | None = None


class ProjectBrief(BaseModel):
    """
    Lightweight projection for listings.
    """
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    slug: str
    location: str | None = None
    status: ProjectStatus
    is_featured: bool
    cover_image_url: str | None = None


class ProjectOut(ProjectBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime

    # Optional nested data for richer detail views
    service: ServiceOut | None = None
    media_items: list[MediaOut] = []
