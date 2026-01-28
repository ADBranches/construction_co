# app/utils/email_sender.py
from __future__ import annotations

from typing import TYPE_CHECKING
from datetime import datetime
import logging

if TYPE_CHECKING:
    from app.models.donation import Donation

logger = logging.getLogger(__name__)


def send_email(to_email: str, subject: str, body: str) -> None:
    """
    Low-level email sender.

    Right now this just logs. Later you can plug in SMTP/SendGrid/etc.
    """
    if not to_email:
        return

    logger.info("Sending email to %s | subject=%s", to_email, subject)
    # TODO: integrate real email backend here.
    # For now we just log; tests will monkeypatch this.


def _format_receipt_body(donation: "Donation") -> str:
    donor_name = donation.donor_name or "Friend"
    amount = donation.amount or 0
    currency = donation.currency or "UGX"

    created_at = donation.created_at or datetime.utcnow()
    created_str = created_at.strftime("%d %b %Y, %H:%M")

    campaign_name = None
    try:
        campaign_name = donation.campaign.name
    except Exception:
        campaign_name = None

    campaign_line = (
        f"Campaign: {campaign_name}\n" if campaign_name else "Campaign: General support\n"
    )

    return (
        f"Hi {donor_name},\n\n"
        f"Thank you for your generous donation to Brisk Farm Solutions.\n\n"
        f"Amount: {amount:,.0f} {currency}\n"
        f"{campaign_line}"
        f"Date: {created_str}\n\n"
        "Your support helps us extend sustainable energy and farm systems to more communities.\n\n"
        "Warm regards,\n"
        "Brisk Farm Solutions & Construction Co.\n"
    )

def send_donation_receipt(donation: Any, *, to_email: str | None = None) -> None:
    """
    Send a plain-text donation receipt email.

    - `donation` is a SQLAlchemy model instance.
    - If `to_email` is not provided, we use donation.donor_email.
    """
    # try to resolve the recipient email
    recipient = to_email or getattr(donation, "donor_email", None)
    if not recipient:
        # no email available, silently skip
        return

    donor_name = getattr(donation, "donor_name", "") or "Friend"
    amount = getattr(donation, "amount", 0)
    currency = getattr(donation, "currency", "UGX")
    status = getattr(donation, "status", "").upper() or "PENDING"
    created_at = getattr(donation, "created_at", None)

    campaign = getattr(donation, "campaign", None)
    campaign_name = getattr(campaign, "name", "General Support")

    subject = f"Thank you for your donation to {campaign_name}"

    created_str = created_at.isoformat() if hasattr(created_at, "isoformat") else str(created_at)

    body_lines = [
        f"Dear {donor_name},",
        "",
        "Thank you for supporting Brisk Farm Solutions & Construction Company.",
        "",
        f"Donation details:",
        f"  - Campaign: {campaign_name}",
        f"  - Amount: {amount:,} {currency}",
        f"  - Status: {status}",
        f"  - Date: {created_str}",
        "",
        "This email serves as a simple receipt for your contribution.",
        "",
        "With gratitude,",
        "Brisk Farm Solutions & Construction Co.",
    ]
    body = "\n".join(body_lines)

    # we assume you already have a send_email(...) helper in this module
    send_email(
        to_email=recipient,
        subject=subject,
        body=body,
    )

# --- Backwards-compatible helper for inquiry emails -----------------
# logger is already imported at the top of the file; redundant import removed.


def send_inquiry_notification(*args, **kwargs) -> None:
    """
    Backwards-compatible shim used by app.api.v1.inquiries.

    We accept *args/**kwargs so this stays flexible regardless of the exact
    call signature in inquiries.py. If you later want richer behavior,
    update this function (subject/body) but keep the name.
    """
    logger.info("send_inquiry_notification called (compat stub)", extra={
        "args": str(args),
        "kwargs": str(kwargs),
    })
    # No return value needed; side-effect only.
    return None

