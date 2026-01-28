# app/services/payment_provider_service.py
from __future__ import annotations

import hashlib
import hmac
import json
from typing import Tuple

from sqlalchemy.orm import Session

from app.config import settings
from app.models.donation import Donation, DonationStatus


class WebhookSignatureError(Exception):
    """Raised when webhook signature is invalid."""


ALLOWED_PAYMENT_METHODS = {"card", "mtn_momo", "airtel_momo"}


def create_payment_session(db: Session, donation: Donation) -> dict:
    """
    Create a checkout/payment session for the donation.

    Multi-channel dummy implementation:
      - Uses payment_method: "card" | "mtn_momo" | "airtel_momo"
      - Returns a fake payment_url based on the channel.
      - Stores provider_session_id/provider_payment_id on the donation.

    Later you can swap this to Stripe/Flutterwave/etc. while keeping
    the same interface and tests.
    """
    method = (donation.payment_method or "card").lower()
    if method not in ALLOWED_PAYMENT_METHODS:
        # Normalise unknown → card, or you can raise
        method = "card"
        donation.payment_method = method

    provider_name = settings.payment_provider_name or "dummy"

    # Make the session_id include method for easier debugging
    session_id = f"{provider_name}_{method}_session_{donation.id}"

    # Very simple base URL; in real life this would be Stripe/Flutterwave checkout URL
    base_url = "https://payments.example.local"
    if method == "card":
        path = f"/card/checkout/{session_id}"
    elif method == "mtn_momo":
        path = f"/mtn-momo/checkout/{session_id}"
    else:  # airtel_momo
        path = f"/airtel-momo/checkout/{session_id}"

    payment_url = f"{base_url}{path}"

    donation.payment_provider = provider_name
    donation.provider_session_id = session_id
    donation.provider_payment_id = session_id
    donation.provider_status = "created"

    db.commit()
    db.refresh(donation)

    return {
        "provider": provider_name,
        "session_id": session_id,
        "payment_url": payment_url,
        "payment_method": method,
    }


def _compute_signature(secret: str, body: bytes) -> str:
    return hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()


def verify_webhook_signature(body: bytes, header_signature: str | None) -> None:
    """
    Verify HMAC-SHA256 signature from header using payment_webhook_secret.

    Header: X-Payment-Signature
    Signature: hex(hmac_sha256(secret, raw_body))

    Raises WebhookSignatureError on failure.
    """
    secret = settings.payment_webhook_secret
    if not secret:
        raise WebhookSignatureError("Webhook secret is not configured.")

    if not header_signature:
        raise WebhookSignatureError("Missing webhook signature header.")

    expected = _compute_signature(secret, body)

    if not hmac.compare_digest(expected, header_signature):
        raise WebhookSignatureError("Invalid webhook signature.")


def parse_webhook_event(body: bytes) -> dict:
    """
    Parse the webhook payload into a dict.

    For Phase 3, we assume a generic payload like:

    {
      "provider": "dummy",
      "event_type": "payment.success",
      "session_id": "dummy_card_session_...",
      "status": "success",
      "amount": 100000,
      "currency": "UGX",
      "payment_method": "card" | "mtn_momo" | "airtel_momo"
    }
    """
    try:
        event = json.loads(body.decode("utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError("Invalid JSON payload.") from exc

    if "session_id" not in event or "status" not in event:
        raise ValueError("Webhook payload missing required fields.")

    return event


def map_provider_status_to_donation_status(provider_status: str) -> DonationStatus:
    s = provider_status.lower()

    if s in {"success", "succeeded", "paid", "completed"}:
        return DonationStatus.CONFIRMED
    if s in {"failed", "declined"}:
        return DonationStatus.FAILED
    if s in {"refunded", "charge_refunded"}:
        return DonationStatus.REFUNDED

    # Default fallback
    return DonationStatus.PENDING


def apply_webhook_to_donation(db: Session, event: dict) -> Tuple[Donation, DonationStatus]:
    """
    Given a provider event (already validated & parsed),
    find the corresponding donation and update its status.
    """
    session_id = event["session_id"]
    provider_status = event["status"]

    donation = (
        db.query(Donation)
        .filter(Donation.provider_session_id == session_id)
        .first()
    )
    if not donation:
        raise ValueError("Donation matching this session_id not found.")

    new_status = map_provider_status_to_donation_status(provider_status)
    donation.status = new_status
    donation.provider_status = provider_status

    db.commit()
    db.refresh(donation)

    return donation, new_status
