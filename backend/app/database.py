# backend/app/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from .config import get_settings

settings = get_settings()


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


# Sync engine (simple & robust for FastAPI + Postgres)
engine = create_engine(
    settings.database_url,
    future=True,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# FastAPI dependency (we'll use this later in routers/services)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
