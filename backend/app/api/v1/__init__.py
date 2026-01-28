# app/api/v1/__init__.py

from fastapi import APIRouter

from app.api.v1 import (
    auth,
    services,
    projects,
    media,
    inquiries,
    users,
    testimonials,
    subscribers,
    campaigns,
    donations,
)

# All v1 routes will live under /api/v1
api_v1_router = APIRouter(prefix="/api/v1")

# Attach each module router under that prefix
api_v1_router.include_router(auth.router)
api_v1_router.include_router(services.router)
api_v1_router.include_router(projects.router)
api_v1_router.include_router(media.router)
api_v1_router.include_router(inquiries.router)
api_v1_router.include_router(users.router)
api_v1_router.include_router(testimonials.router)
api_v1_router.include_router(subscribers.router)
api_v1_router.include_router(campaigns.router)
api_v1_router.include_router(donations.router)

#  When you later add testimonials/subscribers modules, you’ll extend this file:
# from app.api.v1 import testimonials, subscribers
# api_v1_router.include_router(testimonials.router)
# api_v1_router.include_router(subscribers.router)
