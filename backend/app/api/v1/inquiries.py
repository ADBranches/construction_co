from uuid import UUID
from datetime import date

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
@router.get("", response_model=dict)
def list_inquiries(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),

    # Pagination
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),

    # Filters
    status: InquiryStatus | None = Query(None),
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
):
    """
    Admin: List inquiries with filtering, sorting & pagination.
    """

    query = db.query(Inquiry)

    # -----------------------
    # Filters
    # -----------------------
    if status is not None:
        query = query.filter(Inquiry.status == status)

    if start_date:
        query = query.filter(Inquiry.created_at >= start_date)

    if end_date:
        query = query.filter(Inquiry.created_at <= end_date)

    # -----------------------
    # Sorting
    # -----------------------
    query = query.order_by(Inquiry.created_at.desc())

    # -----------------------
    # Pagination
    # -----------------------
    total = query.count()
    items = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items,
    }


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
