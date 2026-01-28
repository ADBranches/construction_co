# app/config.py
from functools import lru_cache
from typing import List  # you can drop this and use built-in list[...] if you want

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator

from dotenv import load_dotenv 
load_dotenv() 
class Settings(BaseSettings):
    # App metadata
    app_name: str = "Construction Backend"
    app_env: str = "development"  # development | docker | production
    backend_port: int = 8000

    # Database URLs for multi-environment setup
    database_url_local: str | None = None
    database_url_docker: str | None = None

    # JWT auth configuration
    jwt_secret_key: str = ""
    jwt_algorithm: str = "HS256"

    # CORS settings
    cors_origins: List[AnyHttpUrl] | List[str] = []  # or: list[AnyHttpUrl] | list[str]

    # ✅ PAYMENT / DONATION CONFIG (match your .env keys)
    payment_provider_name: str = "dummy"
    payment_webhook_secret: str = "changeme-webhook-secret"
    payment_public_key: str | None = None
    payment_secret_key: str | None = None


    # 🔁 Pydantic v2-style config
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # 👈 important: don't crash on extra env vars
    )

    # ░░░░░░░░░░░░░░░░░░░░░
    #   AUTO-SELECT DB URL
    # ░░░░░░░░░░░░░░░░░░░░░
    @property
    def database_url(self) -> str:
        """
        Automatically select the correct database URL based on environment.

        development => LOCAL database (localhost)
        docker      => Docker network (db hostname)
        production  => uses docker URL unless overridden
        """
        env = (self.app_env or "").lower()

        if env in {"docker", "production"}:
            if not self.database_url_docker:
                raise ValueError("DATABASE_URL_DOCKER is not set in the environment.")
            return self.database_url_docker

        # Default path → Local/Postgres on host machine
        if not self.database_url_local:
            raise ValueError("DATABASE_URL_LOCAL is not set in the environment.")
        return self.database_url_local

    # -----------------------------
    # Fix comma-separated CORS list
    # -----------------------------
    @field_validator("cors_origins", mode="before")
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v


@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
