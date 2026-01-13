# app/api/v1/subscribers.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.models.subscriber import Subscriber
from app.schemas.subscriber import SubscriberCreate, SubscriberOut

router = APIRouter(prefix="/subscribers", tags=["Subscribers"])


@router.post("", response_model=SubscriberOut, status_code=status.HTTP_201_CREATED)
def create_subscriber(
    subscriber_in: SubscriberCreate,
    db: Session = Depends(get_db),
):
    """
    Public: add a new email subscriber.

    Idempotent: if email already exists, return existing subscriber instead
    of raising an error, to avoid annoying users.
    """
    existing = (
        db.query(Subscriber)
        .filter(Subscriber.email == subscriber_in.email)
        .first()
    )
    if existing:
        return existing

    subscriber = Subscriber(email=subscriber_in.email)
    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return subscriber


@router.get("", response_model=list[SubscriberOut])
def list_subscribers(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """
    Admin: list subscribers with simple pagination.
    """
    subscribers = (
        db.query(Subscriber)
        .order_by(Subscriber.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return subscribers
