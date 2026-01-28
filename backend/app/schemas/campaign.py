# app/schemas/campaign.py
from __future__ import annotations

from datetime import datetime, date
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.campaign import CampaignStatus


class CampaignBase(BaseModel):
    name: str
    slug: str
    short_description: Optional[str] = None
    description: Optional[str] = None

    currency: str = "UGX"
    target_amount: Optional[int] = None  # major units (e.g. UGX)

    hero_image_url: Optional[str] = None
    sort_order: int = 0

    start_date: Optional[date] = None
    end_date: Optional[date] = None


class CampaignCreate(CampaignBase):
    status: CampaignStatus = CampaignStatus.ACTIVE
    is_featured: bool = False


class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None

    currency: Optional[str] = None
    target_amount: Optional[int] = None

    hero_image_url: Optional[str] = None
    sort_order: Optional[int] = None

    start_date: Optional[date] = None
    end_date: Optional[date] = None

    status: Optional[CampaignStatus] = None
    is_featured: Optional[bool] = None


class CampaignPublic(CampaignBase):
    id: UUID
    status: CampaignStatus
    is_featured: bool
    raised_amount: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CampaignAdmin(CampaignPublic):
    # Reserved for any admin-only fields later (e.g. internal notes)
    pass
