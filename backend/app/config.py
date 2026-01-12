from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator


class Settings(BaseSettings):
    # App metadata
    app_name: str = "Construction Backend"
    app_env: str = "development"  # can be: development | docker | production
    backend_port: int = 8000

    # Database URLs for multi-environment setup
    database_url_local: str | None = None
    database_url_docker: str | None = None

    # JWT auth configuration
    jwt_secret_key: str =""
    jwt_algorithm: str = "HS256"

    # CORS settings
    cors_origins: List[AnyHttpUrl] | List[str] = []

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

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
        if self.app_env.lower() == "docker":
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
