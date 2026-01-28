# app/api/v1/donations.py
from __future__ import annotations

from uuid import UUID
from datetime import datetime
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    status,
)
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.donation import Donation, DonationStatus
from app.schemas.donation import (
    DonationCreate,
    DonationPublic,
    DonationAdmin,
    DonationIntentResponse,
)
from app.services.donation_service import (
    create_donation,
    list_donations,
    get_donation,
)
from app.services.payment_provider_service import (
    create_payment_session,
    verify_webhook_signature,
    parse_webhook_event,
    apply_webhook_to_donation,
    WebhookSignatureError,
)

router = APIRouter(prefix="/donations", tags=["Donations"])


# ---------------------------
# Public endpoint – create intent
# ---------------------------

@router.post(
    "",
    response_model=DonationIntentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_donation_intent(
    payload: DonationCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Public: create a donation record in PENDING state
    and create a payment session with the provider.

    Supports payment_method:
      - "card"
      - "mtn_momo"
      - "airtel_momo"
    """
    if payload.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donation amount must be greater than zero.",
        )

    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")

    try:
        donation = create_donation(
            db,
            payload,
            ip_address=ip_address,
            user_agent=user_agent,
        )
    except ValueError as exc:
        # from donation_service (e.g. campaign closed)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    # Phase 3: create payment session (card / MoMo)
    session_info = create_payment_session(db, donation)

    public = DonationPublic.model_validate(donation)
    return DonationIntentResponse(
        donation=public,
        payment_url=session_info.get("payment_url"),
        provider_session_id=session_info.get("session_id"),
    )


# ---------------------------
# Admin endpoints
# ---------------------------
@router.get(
    "",
    response_model=list[DonationAdmin],
)
def admin_list_donations(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
    campaign_id: UUID | None = Query(
        None,
        description="Filter donations by campaign ID",
    ),
    status: DonationStatus | None = Query(
        None,
        alias="status",
        description="Filter by donation status: pending|confirmed|failed|refunded",
    ),
    date_from: str | None = Query(
        None,
        description="Include donations created at or after this ISO8601 datetime",
    ),
    date_to: str | None = Query(
        None,
        description="Include donations created at or before this ISO8601 datetime",
    ),
    min_amount: int | None = Query(
        None, ge=0, description="Filter donations with amount >= this value"
    ),
    max_amount: int | None = Query(
        None, ge=0, description="Filter donations with amount <= this value"
    ),
    skip: int = Query(0, ge=0, description="Offset for pagination"),
    limit: int = Query(100, ge=1, le=200, description="Page size, max 200"),
):
    """
    Admin-only: list donations with filters.

    Keeps existing behaviour (list all) when no filters are provided.
    Adds optional filters:

    - campaign_id
    - status
    - date_from / date_to (created_at range, ISO8601 string)
    - min_amount / max_amount
    """

    def _parse_iso_datetime(value: str) -> datetime:
        """
        Robust ISO8601 parser that also handles the common case where
        a timezone offset like '+00:00' was decoded as a space:

            '2026-01-20T10:00:00+00:00'  → correct
            '2026-01-20T10:00:00 00:00'  → fix to have '+' again

        We only apply the space→'+' fix when there is a 'T' (date/time separator),
        a space, and no '+' already in the string – matching the pattern produced
        by isoformat() with an offset passed raw in a query string.
        """
        raw = value
        if "T" in raw and " " in raw and "+" not in raw:
            # Replace only the first space – turns '...T10:00:00 00:00'
            # back into '...T10:00:00+00:00'
            raw = raw.replace(" ", "+", 1)
        return datetime.fromisoformat(raw)

    query = db.query(Donation)

    if campaign_id is not None:
        query = query.filter(Donation.campaign_id == campaign_id)

    if status is not None:
        query = query.filter(Donation.status == status)

    # Parse optional date range
    parsed_from = None
    parsed_to = None

    if date_from:
        try:
            parsed_from = _parse_iso_datetime(date_from)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date_from; expected ISO8601 datetime string.",
            )

    if date_to:
        try:
            parsed_to = _parse_iso_datetime(date_to)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid date_to; expected ISO8601 datetime string.",
            )

    if parsed_from is not None:
        query = query.filter(Donation.created_at >= parsed_from)

    if parsed_to is not None:
        query = query.filter(Donation.created_at <= parsed_to)

    if min_amount is not None:
        query = query.filter(Donation.amount >= min_amount)

    if max_amount is not None:
        query = query.filter(Donation.amount <= max_amount)

    donations = (
        query.order_by(Donation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    return donations


@router.get(
    "/{donation_id}",
    response_model=DonationAdmin,
)
def admin_get_donation(
    donation_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin-only: get a single donation by id.
    """
    donation = get_donation(db, donation_id)
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found",
        )
    return donation


# ---------------------------
# Webhook endpoint (no auth)
# ---------------------------

@router.post(
    "/webhook",
    status_code=status.HTTP_200_OK,
)
async def donation_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Webhook endpoint for payment provider (card + MoMo).

    - Verifies HMAC signature (X-Payment-Signature)
    - Parses generic payload
    - Maps provider status to DonationStatus
    - Updates donation
    """
    raw_body = await request.body()
    header_sig = request.headers.get("X-Payment-Signature")

    try:
        verify_webhook_signature(raw_body, header_sig)
    except WebhookSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    try:
        event = parse_webhook_event(raw_body)
        donation, new_status = apply_webhook_to_donation(db, event)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return {
        "ok": True,
        "donation_id": str(donation.id),
        "status": new_status.value,
    }
