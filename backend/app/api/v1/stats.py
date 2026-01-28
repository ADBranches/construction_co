# app/api/v1/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from datetime import datetime
from sqlalchemy import func, distinct

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.project import Project
from app.models.service import Service
from app.models.inquiry import Inquiry
from app.models.testimonial import Testimonial
from app.models.subscriber import Subscriber
from app.models.donation import Donation
from app.models.campaign import Campaign

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/")
def admin_stats(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Aggregate counts for the admin dashboard.
    """
    services = db.query(Service).count()
    projects = db.query(Project).count()
    inquiries = db.query(Inquiry).count()
    testimonials = db.query(Testimonial).count()
    subscribers = db.query(Subscriber).count()

    return {
        "services": services,
        "projects": projects,
        "inquiries": inquiries,
        "testimonials": testimonials,
        "subscribers": subscribers,
    }
@router.get("/donations/summary")
def donation_summary(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin-only: donation stats for dashboard widgets.

    - Total amount donated this calendar month
    - Number of donors this month (unique donor_email)
    - Top campaign by total amount (all-time)
    """
    now = datetime.utcnow()
    month_start = datetime(year=now.year, month=now.month, day=1)

    # this month totals (confirmed only)
    month_q = (
        db.query(
            func.coalesce(func.sum(Donation.amount), 0).label("total_amount"),
            func.count(distinct(Donation.donor_email)).label("donors_count"),
        )
        .filter(Donation.status == "confirmed")
        .filter(Donation.created_at >= month_start)
        .filter(Donation.created_at <= now)
    ).one()

    month_total = int(month_q.total_amount or 0)
    donors_count = int(month_q.donors_count or 0)

    # top campaign (all time, confirmed)
    top_campaign_row = (
        db.query(
            Campaign.id,
            Campaign.name,
            func.coalesce(func.sum(Donation.amount), 0).label("total_amount"),
        )
        .join(Donation, Donation.campaign_id == Campaign.id)
        .filter(Donation.status == "confirmed")
        .group_by(Campaign.id, Campaign.name)
        .order_by(func.sum(Donation.amount).desc())
        .first()
    )

    top_campaign = None
    if top_campaign_row:
        top_campaign = {
            "id": top_campaign_row.id,
            "name": top_campaign_row.name,
            "total_amount": int(top_campaign_row.total_amount or 0),
        }

    return {
        "month_total": month_total,
        "donors_count": donors_count,
        "top_campaign": top_campaign,
    }