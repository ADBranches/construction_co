# backend/app/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

from .config import get_settings

# Routers
from .api.v1.auth import router as auth_router
from .api.v1.users import router as users_router
from .api.v1.projects import router as projects_router
from .api.v1.services import router as services_router
from .api.v1.inquiries import router as inquiries_router
from .api.v1.media import router as media_router
from .api.v1 import testimonials
from .api.v1 import subscribers
from app.api.v1 import api_v1_router
from app.api.v1.stats import router as stats_router

settings = get_settings()

# -----------------------------------------------------
# FastAPI Application
# -----------------------------------------------------
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# -----------------------------------------------------
# CORS Middleware
# -----------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://brisk-construction-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Logging Middleware (Request Logging)
# -----------------------------------------------------
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = round((time.time() - start_time) * 1000, 2)
    method = request.method
    url = request.url.path
    status = response.status_code

    print(f"{method} {url} → {status} [{duration}ms]")

    return response

# -----------------------------------------------------
# API Routers
# -----------------------------------------------------
app.include_router(auth_router,      prefix="/api/v1", tags=["Auth"])
app.include_router(users_router,     prefix="/api/v1", tags=["Users"])
app.include_router(projects_router,  prefix="/api/v1", tags=["Projects"])
app.include_router(services_router,  prefix="/api/v1", tags=["Services"])
app.include_router(inquiries_router, prefix="/api/v1", tags=["Inquiries"])
app.include_router(media_router,     prefix="/api/v1", tags=["Media"])
app.include_router(testimonials.router, prefix="/api/v1", tags=["Testimonials"])
app.include_router(subscribers.router, prefix="/api/v1", tags=["Subscribers"])
app.include_router(api_v1_router)
app.include_router(stats_router,     prefix="/api/v1", tags=["Stats"]) 

# -----------------------------------------------------
# Health Check Endpoint
# -----------------------------------------------------
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "environment": settings.app_env,
        "database_connected": bool(settings.database_url),
    }
