# app/api/v1/campaigns.py
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.campaign import Campaign, CampaignStatus
from app.schemas.campaign import (
    CampaignCreate,
    CampaignUpdate,
    CampaignPublic,
    CampaignAdmin,
)

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])


# ---------------------------
# Public endpoints
# ---------------------------
@router.get("", response_model=list[CampaignPublic])
def list_campaigns(
    db: Session = Depends(get_db),
    status: CampaignStatus | None = Query(
        None,
        alias="status",  # keeps ?status=active working
        description="Optional filter by campaign status (draft|active|closed|archived)",
    ),
    is_featured: bool | None = Query(
        None,
        description="If true, only featured campaigns are returned",
    ),
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(50, ge=1, le=200, description="Page size, max 200"),
):
    """
    Public: list campaigns.

    - Optional filter by status (draft, active, closed, archived)
    - Optional filter by is_featured
    - Pagination via skip / limit
    - Ordered by sort_order then most recent
    """
    query = db.query(Campaign)

    if status is not None:
        query = query.filter(Campaign.status == status)

    if is_featured is not None:
        query = query.filter(Campaign.is_featured == is_featured)

    campaigns = (
        query.order_by(Campaign.sort_order, Campaign.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return campaigns



@router.get("/{slug}", response_model=CampaignPublic)
def get_campaign_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    Public: get campaign details by slug.
    """
    campaign = (
        db.query(Campaign)
        .filter(Campaign.slug == slug)
        .first()
    )
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )
    return campaign


# ---------------------------
# Admin endpoints
# ---------------------------

@router.post(
    "",
    response_model=CampaignAdmin,
    status_code=status.HTTP_201_CREATED,
)
def create_campaign(
    payload: CampaignCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin-only: create a new campaign.
    """
    # unique slug check
    exists = (
        db.query(Campaign)
        .filter(Campaign.slug == payload.slug)
        .first()
    )
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Campaign slug already exists",
        )

    campaign = Campaign(
        name=payload.name,
        slug=payload.slug,
        short_description=payload.short_description,
        description=payload.description,
        currency=payload.currency,
        target_amount=payload.target_amount,
        hero_image_url=payload.hero_image_url,
        sort_order=payload.sort_order,
        start_date=payload.start_date,
        end_date=payload.end_date,
        status=payload.status,
        is_featured=payload.is_featured,
    )

    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


@router.put(
    "/{campaign_id}",
    response_model=CampaignAdmin,
)
def update_campaign(
    campaign_id: UUID,
    payload: CampaignUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin-only: update an existing campaign.
    """
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    # If slug is changing, enforce uniqueness
    if "slug" in update_data and update_data["slug"] != campaign.slug:
        dup = (
            db.query(Campaign)
            .filter(Campaign.slug == update_data["slug"])
            .first()
        )
        if dup:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Another campaign with that slug already exists",
            )

    for field, value in update_data.items():
        setattr(campaign, field, value)

    db.commit()
    db.refresh(campaign)
    return campaign


@router.delete(
    "/{campaign_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def soft_delete_campaign(
    campaign_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin-only: soft delete a campaign.

    Implementation: set status=archived and is_featured=False.
    """
    campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found",
        )

    campaign.status = CampaignStatus.ARCHIVED
    campaign.is_featured = False

    db.commit()
    return None
