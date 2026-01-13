"""add role column to users

Revision ID: 9757b54e5a7e
Revises: 0f0405ef4fc2
Create Date: 2026-01-12 17:03:23.640280

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9757b54e5a7e'
down_revision: Union[str, Sequence[str], None] = '0f0405ef4fc2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
