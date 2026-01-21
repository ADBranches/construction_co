"""add marketing fields to services

Revision ID: 6249d337e8ad
Revises: ce7d63c991ee
Create Date: 2026-01-21 13:05:49.008123

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6249d337e8ad'
down_revision: Union[str, Sequence[str], None] = 'ce7d63c991ee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
