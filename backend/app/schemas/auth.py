# backend/app/schemas/auth.py
from pydantic import BaseModel, ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    """
    Payload we expect inside our JWT.
    """
    model_config = ConfigDict(from_attributes=True)

    sub: str | None = None  # user ID
    exp: int | None = None
