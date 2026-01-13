"""add user role

Revision ID: 0f0405ef4fc2
Revises: e5792ceeb4d4
Create Date: 2026-01-12 16:35:56.163553

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0f0405ef4fc2'
down_revision: Union[str, Sequence[str], None] = 'e5792ceeb4d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
