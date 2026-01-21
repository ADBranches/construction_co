# app/api/v1/subscribers.py
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.subscriber import Subscriber
from app.schemas.subscriber import SubscriberOut, SubscriberCreate

router = APIRouter(prefix="/subscribers", tags=["Subscribers"])


@router.post("", response_model=SubscriberOut, status_code=status.HTTP_201_CREATED)
def create_subscriber(
    subscriber_in: SubscriberCreate,
    db: Session = Depends(get_db),
):
    """
    Public: add a newsletter subscriber.

    - Normalizes email (lowercase + trim)
    - Idempotent: if email already exists, returns existing subscriber.
    """
    email_norm = subscriber_in.email.lower().strip()

    existing = (
        db.query(Subscriber)
        .filter(Subscriber.email.ilike(email_norm))
        .first()
    )
    if existing:
        return existing

    sub = Subscriber(email=email_norm)
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


@router.get("", response_model=list[SubscriberOut])
def list_subscribers(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """
    Admin-only: list newsletter subscribers (newest first).
    """
    subscribers = (
        db.query(Subscriber)
        .order_by(Subscriber.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return subscribers
