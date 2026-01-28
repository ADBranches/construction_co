# tests/services/test_donation_emails.py
from types import SimpleNamespace

from app.utils import email_sender


def test_send_donation_receipt_uses_donor_email_and_campaign(monkeypatch):
    calls = {}

    def fake_send_email(to_email, subject, body, **kwargs):
        calls["to"] = to_email
        calls["subject"] = subject
        calls["body"] = body

    monkeypatch.setattr(email_sender, "send_email", fake_send_email)

    # Dummy campaign & donation objects (no DB hit)
    campaign = SimpleNamespace(name="Biogas for Schools")
    donation = SimpleNamespace(
        donor_email="donor@example.com",
        donor_name="Test Donor",
        amount=50000,
        currency="UGX",
        status="confirmed",
        campaign=campaign,
        created_at=None,
    )

    email_sender.send_donation_receipt(donation)

    assert calls["to"] == "donor@example.com"
    assert "Biogas for Schools" in calls["subject"]
    assert "50,000 UGX" in calls["body"] or "50000 UGX" in calls["body"]
    assert "Test Donor" in calls["body"]

