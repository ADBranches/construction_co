# backend/app/api/v1/services.py
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.models.service import Service
from app.schemas.service import ServiceOut, ServiceCreate, ServiceUpdate

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=list[ServiceOut])
def list_services(
    db: Session = Depends(get_db),
    is_active: bool | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """
    Public: list services (optionally filter by is_active).
    """
    query = db.query(Service)

    if is_active is not None:
        query = query.filter(Service.is_active == is_active)

    services = (
        query.order_by(Service.display_order.asc(), Service.name.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return services


@router.get("/{slug}", response_model=ServiceOut)
def get_service_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    """
    Public: get a service by slug.
    """
    service = db.query(Service).filter(Service.slug == slug).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found.",
        )
    return service


@router.post("", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: create a new service.
    """
    # Ensure unique slug
    existing = db.query(Service).filter(Service.slug == service_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already in use.",
        )

    service = Service(**service_in.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: UUID,
    service_in: ServiceUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: update an existing service.
    """
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found.",
        )

    update_data = service_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: delete a service.
    """
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found.",
        )

    db.delete(service)
    db.commit()
    return None
