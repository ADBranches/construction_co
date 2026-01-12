# backend/app/utils/email_sender.py
from typing import Any

from .logger import get_logger

logger = get_logger("email_sender")


def send_inquiry_notification(to_email: str, subject: str, body: str, meta: dict[str, Any] | None = None) -> None:
    """
    Stub for sending inquiry notification emails.

    In production, wire this up to an SMTP server or transactional email
    service (SendGrid, Mailgun, SES, etc.).
    """
    logger.info(
        "Email notification stub: to=%s subject=%r meta=%s",
        to_email,
        subject,
        meta or {},
    )
    # TODO: implement real email sending for production
