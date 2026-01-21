# backend/app/api/v1/services.py

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.models.service import Service
from app.schemas.service import ServiceOut, ServiceCreate, ServiceUpdate

# 🔹 Import service layer logic
from app.services.service_service import (
    create_service as svc_create_service,
    update_service as svc_update,
    delete_service as svc_delete,
)

router = APIRouter(prefix="/services", tags=["Services"])


# ---------------------------------------------------------
# List Services (Public)
# ---------------------------------------------------------
@router.get("", response_model=list[ServiceOut])
def list_services(
    db: Session = Depends(get_db),
    is_active: bool | None = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    query = db.query(Service)

    if is_active is None:
        # Default public behaviour → only show active services
        query = query.filter(Service.is_active == True)  # noqa: E712
    else:
        query = query.filter(Service.is_active == is_active)

    services = (
        query.order_by(Service.display_order.asc(), Service.name.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return services


# ---------------------------------------------------------
# Get Service By Slug (Public)
# ---------------------------------------------------------
@router.get("/{slug}", response_model=ServiceOut)
def get_service_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    service = db.query(Service).filter(Service.slug == slug).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found.",
        )
    return service


# ---------------------------------------------------------
# Create Service (Admin)
# ---------------------------------------------------------
@router.post("", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    # Ensure unique slug before delegating to service layer
    existing = db.query(Service).filter(Service.slug == service_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already in use.",
        )

    try:
        return svc_create_service(db, service_in)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------
# Update Service (Admin)
# ---------------------------------------------------------
@router.put("/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: UUID,
    service_in: ServiceUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    try:
        return svc_update(db, service_id, service_in)
    except ValueError as e:
        # Service layer raises ValueError when service_id not found
        raise HTTPException(status_code=404, detail=str(e))


# ---------------------------------------------------------
# Delete Service (Admin)
# ---------------------------------------------------------
@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    try:
        svc_delete(db, service_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return None
