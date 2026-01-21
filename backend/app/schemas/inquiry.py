from datetime import datetime
from uuid import UUID

from pydantic import (
    BaseModel,
    EmailStr,
    ConfigDict,
    Field,
    AliasChoices,
    field_validator,
)

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
    assigned_to_id: UUID | None = None


class InquiryCreate(InquiryBase):
    # status is always NEW when created from the public site
    pass


class InquiryUpdate(BaseModel):
    """
    Admin-side partial update.

    - All fields optional (so you can send only `status` or only `internal_notes`)
    - Accepts both `internal_notes` and `internalNotes` from the frontend
    - Status is case-insensitive: "NEW", "New", "new" all work
    """

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
    assigned_to_id: UUID | None = None

    # status: NEW / IN_REVIEW / QUOTED / CLOSED (but we accept relaxed strings too)
    status: InquiryStatus | None = None

    # 👇 accept both snake_case and camelCase body keys
    internal_notes: str | None = Field(
      default=None,
      validation_alias=AliasChoices("internal_notes", "internalNotes"),
    )

    @field_validator("status", mode="before")
    @classmethod
    def normalize_status(cls, v):
        """
        Accept 'new', 'NEW', 'New', etc. and map to the enum.
        If value is None, leave it alone.
        """
        if v is None:
            return v

        if isinstance(v, InquiryStatus):
            return v

        if isinstance(v, str):
            key = v.strip().lower()
            mapping = {
                "new": InquiryStatus.NEW,
                "in_review": InquiryStatus.IN_REVIEW,
                "quoted": InquiryStatus.QUOTED,
                "closed": InquiryStatus.CLOSED,
            }
            if key in mapping:
                return mapping[key]

        # Let Pydantic raise if it really doesn't match anything
        return v


class InquiryOut(InquiryBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    status: InquiryStatus
    internal_notes: str | None = None
    created_at: datetime
    updated_at: datetime
