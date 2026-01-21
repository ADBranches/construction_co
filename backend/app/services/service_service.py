# app/services/service_service.py
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate


def list_services(db: Session):
    return (
        db.query(Service)
        .order_by(Service.display_order.asc(), Service.name.asc())
        .all()
    )


# ---------------------------------------------------------
# Create
# ---------------------------------------------------------
def create_service(db: Session, service_in: ServiceCreate):
    # NOTE:
    # Do NOT check slug here — router already checks slug uniqueness.
    # Tests expect create_service to always succeed when router allows it.

    service = Service(**service_in.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


# ---------------------------------------------------------
# Update
# ---------------------------------------------------------
def update_service(db: Session, service_id: UUID, service_in: ServiceUpdate):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise ValueError("Service not found")

    update_data = service_in.model_dump(exclude_unset=True)

    # Apply updates safely
    for field, value in update_data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


# ---------------------------------------------------------
# Delete
# ---------------------------------------------------------
def delete_service(db: Session, service_id: UUID):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise ValueError("Service not found")

    db.delete(service)
    db.commit()
