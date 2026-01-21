# app/api/v1/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.project import Project
from app.models.service import Service
from app.models.inquiry import Inquiry
from app.models.testimonial import Testimonial
from app.models.subscriber import Subscriber

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
