"""add user role enum and columns

Revision ID: 1483ce9ae098
Revises: 9757b54e5a7e
Create Date: 2026-01-12 17:13:16.968737

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "1483ce9ae098"
down_revision: Union[str, Sequence[str], None] = "9757b54e5a7e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: ensure enum is clean, then add role column."""

    bind = op.get_bind()

    # 1) Drop any old user_role type so we can redefine it cleanly
    op.execute("DROP TYPE IF EXISTS user_role CASCADE")

    # 2) Create enum with UPPERCASE values to match what SQLAlchemy sends ("ADMIN", "STAFF")
    user_role_enum = postgresql.ENUM(
        "ADMIN",
        "STAFF",
        name="user_role",
    )
    user_role_enum.create(bind)

    # 3) Add role column using this enum
    op.add_column(
        "users",
        sa.Column(
            "role",
            user_role_enum,
            nullable=False,
            server_default="STAFF",  # default for existing rows
        ),
    )

    # Optional: remove server_default so app-level default is used going forward
    op.alter_column("users", "role", server_default=None)


def downgrade() -> None:
    """Downgrade schema: drop role column and enum type."""

    op.drop_column("users", "role")
    op.execute("DROP TYPE IF EXISTS user_role CASCADE")
