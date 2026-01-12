# backend/app/api/v1/media.py
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.models.media import Media
from app.schemas.media import MediaOut, MediaCreate, MediaUpdate

router = APIRouter(prefix="/media", tags=["Media"])


@router.get("/project/{project_id}", response_model=list[MediaOut])
def list_media_for_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
):
    """
    Public: list media items for a given project.
    """
    media_items = (
        db.query(Media)
        .filter(Media.project_id == project_id)
        .order_by(Media.sort_order.asc(), Media.created_at.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return media_items


@router.post("", response_model=MediaOut, status_code=status.HTTP_201_CREATED)
def create_media(
    media_in: MediaCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: create a media item (image/video) for a project.
    """
    media = Media(**media_in.model_dump())
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.put("/{media_id}", response_model=MediaOut)
def update_media(
    media_id: UUID,
    media_in: MediaUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: update a media item.
    """
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media item not found.",
        )

    update_data = media_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(media, field, value)

    db.commit()
    db.refresh(media)
    return media


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: delete a media item.
    """
    media = db.query(Media).filter(Media.id == media_id).first()
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media item not found.",
        )

    db.delete(media)
    db.commit()
    return None
