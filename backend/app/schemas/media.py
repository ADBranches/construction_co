from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, HttpUrl, ConfigDict

from app.models.media import MediaType  # or from ..models.media import MediaType


class MediaBase(BaseModel):
    url: HttpUrl
    title: str | None = None
    description: str | None = None
    media_type: MediaType = MediaType.IMAGE
    is_featured: bool = False
    sort_order: int = 0
    project_id: UUID | None = None


class MediaCreate(MediaBase):
    pass


class MediaUpdate(BaseModel):
    url: HttpUrl | None = None
    title: str | None = None
    description: str | None = None
    media_type: MediaType | None = None
    is_featured: bool | None = None
    sort_order: int | None = None
    project_id: UUID | None = None


class MediaOut(MediaBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime
    updated_at: datetime
