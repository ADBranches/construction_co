from uuid import UUID
from datetime import date
from sqlalchemy.exc import DataError

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.models.inquiry import Inquiry, InquiryStatus
from app.schemas.inquiry import InquiryOut, InquiryCreate, InquiryUpdate
from app.utils.email_sender import send_inquiry_notification

router = APIRouter(prefix="/inquiries", tags=["Inquiries"])


# =====================================================
# CREATE INQUIRY (PUBLIC)
# =====================================================
@router.post("", response_model=InquiryOut, status_code=status.HTTP_201_CREATED)
def submit_inquiry(
    inquiry_in: InquiryCreate,
    db: Session = Depends(get_db),
):
    """
    Public: Submit a new inquiry / quote request.
    """

    inquiry = Inquiry(**inquiry_in.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    # 🔔 Fire-and-forget notification
    if inquiry.email:
        send_inquiry_notification(
            to_email="admin@construction.com",  # TODO: move to ENV
            subject="New Inquiry Received",
            body=f"""
New inquiry received:

Name: {inquiry.full_name}
Email: {inquiry.email}
Message: {inquiry.message}
""",
            meta={"inquiry_id": str(inquiry.id)},
        )

    return inquiry

# =====================================================
# LIST INQUIRIES (ADMIN)
# =====================================================
@router.get("", response_model=list[InquiryOut])
def list_inquiries(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),

    # Pagination (kept, even if tests don't use it)
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),

    # Filters
    status: InquiryStatus | None = Query(None),
    source: str | None = Query(None),
    search: str | None = Query(None),
):
    """
    Admin: list inquiries with optional filters.

    - status: NEW | IN_REVIEW | QUOTED | ...
    - source: quote | contact | website | referral | ...
    - search: matches full_name, email, or message
    """
    query = db.query(Inquiry)

    # Status filter
    if status is not None:
        query = query.filter(Inquiry.status == status)

    # Source filter
    if source:
        query = query.filter(Inquiry.source == source)

    # Text search (case-insensitive on name/email/message)
    if search:
        like = f"%{search.lower()}%"
        query = query.filter(
            (Inquiry.full_name.ilike(like))
            | (Inquiry.email.ilike(like))
            | (Inquiry.message.ilike(like))
        )

    # Newest first
    query = query.order_by(Inquiry.created_at.desc())

    # Pagination (still applied, but we just return the list)
    inquiries = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return inquiries


# =====================================================
# UPDATE INQUIRY STATUS (ADMIN)
# =====================================================
@router.patch("/{inquiry_id}/status", response_model=InquiryOut)
def update_inquiry_status(
    inquiry_id: UUID,
    status_value: InquiryStatus = Query(..., alias="status"),
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: Update inquiry status.
    """

    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found.",
        )

    inquiry.status = status_value
    db.commit()
    db.refresh(inquiry)
    return inquiry


# =====================================================
# FULL UPDATE (ADMIN)
# =====================================================
@router.put("/{inquiry_id}", response_model=InquiryOut)
def update_inquiry(
    inquiry_id: UUID,
    inquiry_in: InquiryUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: Update inquiry details (notes, contact info, etc.)
    """

    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found.",
        )

    update_data = inquiry_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(inquiry, field, value)

    db.commit()
    db.refresh(inquiry)
    return inquiry

# =====================================================
# INQUIRY STATS (ADMIN)
# =====================================================
@router.get("/stats", response_model=dict)
def inquiry_stats(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: summary stats for dashboard cards.
    """
    # Total inquiries (safe)
    total = db.query(Inquiry).count()

    # Per-status counts (defensive: handle enum/DB mismatches)
    counts_by_status: dict[str, int] = {}
    for status in InquiryStatus:
        try:
            counts_by_status[status.value] = (
                db.query(Inquiry)
                .filter(Inquiry.status == status)
                .count()
            )
        except DataError:
            # Enum value not present in DB type; keep API alive, report 0
            db.rollback()
            counts_by_status[status.value] = 0

    # "Open-like" statuses: use all statuses except clearly closed ones,
    # without hard-coding names that might not exist.
    # "Open-like" statuses: use all non-closed statuses
    open_like_statuses = [
        status
        for status in InquiryStatus
        if status not in {InquiryStatus.CLOSED}
    ]

    try:
        open_count = (
            db.query(Inquiry)
            .filter(Inquiry.status.in_(open_like_statuses))
            .count()
        )
    except DataError:
        db.rollback()
        open_count = 0

    # NEW count (lowercase enum now)
    new_count = counts_by_status.get(InquiryStatus.NEW.value, 0)

    return {
        "total": total,
        "open": open_count,
        "new": new_count,
        "by_status": counts_by_status,
    }


