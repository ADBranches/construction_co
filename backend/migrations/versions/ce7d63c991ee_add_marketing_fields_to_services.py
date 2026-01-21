"""add marketing fields to services

Revision ID: ce7d63c991ee
Revises: 989a5dd3ebd0
Create Date: 2026-01-21 12:56:54.133898

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ce7d63c991ee'
down_revision: Union[str, Sequence[str], None] = '989a5dd3ebd0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
