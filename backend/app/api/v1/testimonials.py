# app/api/v1/testimonials.py
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.models.testimonial import Testimonial
from app.schemas.testimonial import (
    TestimonialCreate,
    TestimonialOut,
    TestimonialUpdate,
)

router = APIRouter(prefix="/testimonials", tags=["Testimonials"])


@router.get("", response_model=list[TestimonialOut])
def list_testimonials(
    db: Session = Depends(get_db),
    is_active: bool | None = Query(
        True,
        description="If set, filters by active flag. Defaults to only active.",
    ),
    is_featured: bool | None = Query(
        None,
        description="If set, filters to featured/non-featured testimonials.",
    ),
    limit: int = Query(
        20,
        ge=1,
        le=100,
        description="Maximum number of testimonials to return.",
    ),
):
    """
    Public: list testimonials.

    - By default returns only active ones.
    - Can filter by is_featured for homepage highlights.
    """
    query = db.query(Testimonial)

    # Active flag: True → only active, False → only inactive, None → ignore
    if is_active is not None:
        query = query.filter(Testimonial.is_active == is_active)

    # Featured flag filter
    if is_featured is not None:
        query = query.filter(Testimonial.is_featured == is_featured)

    testimonials = (
        query.order_by(
            Testimonial.display_order.asc(),
            Testimonial.created_at.desc(),
        )
        .limit(limit)
        .all()
    )
    return testimonials


@router.post("", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
def create_testimonial(
    testimonial_in: TestimonialCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: create a new testimonial.
    """
    testimonial = Testimonial(**testimonial_in.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.put("/{testimonial_id}", response_model=TestimonialOut)
def update_testimonial(
    testimonial_id: UUID,
    testimonial_in: TestimonialUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: update testimonial fields.
    """
    testimonial = (
        db.query(Testimonial)
        .filter(Testimonial.id == testimonial_id)
        .first()
    )
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found.",
        )

    update_data = testimonial_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(testimonial, field, value)

    db.commit()
    db.refresh(testimonial)
    return testimonial


@router.delete("/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(
    testimonial_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: delete a testimonial.
    """
    testimonial = (
        db.query(Testimonial)
        .filter(Testimonial.id == testimonial_id)
        .first()
    )
    if not testimonial:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found.",
        )

    db.delete(testimonial)
    db.commit()
    return None
