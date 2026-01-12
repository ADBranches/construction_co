from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.inquiry import InquiryStatus  # or from ..models.inquiry import InquiryStatus


class InquiryBase(BaseModel):
    full_name: str
    email: EmailStr | None = None
    phone: str | None = None
    project_type: str | None = None
    budget_range: str | None = None
    location: str | None = None
    message: str | None = None
    source: str | None = None
    service_id: UUID | None = None
    project_id: UUID | None = None


class InquiryCreate(InquiryBase):
    # status is always NEW when created from the public site
    pass


class InquiryUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    project_type: str | None = None
    budget_range: str | None = None
    location: str | None = None
    message: str | None = None
    source: str | None = None
    service_id: UUID | None = None
    project_id: UUID | None = None
    status: InquiryStatus | None = None


class InquiryOut(InquiryBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    status: InquiryStatus
    created_at: datetime
    updated_at: datetime
