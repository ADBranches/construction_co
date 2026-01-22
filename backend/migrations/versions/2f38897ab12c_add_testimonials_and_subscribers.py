"""add testimonials and subscribers

Revision ID: 2f38897ab12c
Revises: 1483ce9ae098
Create Date: 2026-01-12 19:26:32.858177
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "2f38897ab12c"
down_revision: Union[str, Sequence[str], None] = "1483ce9ae098"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
  """Upgrade schema.

  Final desired state: testimonials + subscribers tables exist
  with the schema we use in the app.
  This is safe on a fresh DB and on an old DB.
  """

  # Clean up any old versions if they exist (no-op on fresh DB)
  op.execute("DROP INDEX IF EXISTS ix_subscribers_email")
  op.execute("DROP TABLE IF EXISTS subscribers CASCADE")
  op.execute("DROP TABLE IF EXISTS testimonials CASCADE")

  # Re-create testimonials table
  op.create_table(
    "testimonials",
    sa.Column("id", sa.UUID(), primary_key=True, nullable=False),
    sa.Column("name", sa.VARCHAR(length=255), nullable=False),
    sa.Column("role", sa.VARCHAR(length=255), nullable=True),
    sa.Column("company", sa.VARCHAR(length=255), nullable=True),
    sa.Column("quote", sa.TEXT(), nullable=False),
    sa.Column("is_featured", sa.BOOLEAN(), nullable=False),
    sa.Column("is_active", sa.BOOLEAN(), nullable=False),
    sa.Column(
      "created_at",
      postgresql.TIMESTAMP(timezone=True),
      server_default=sa.text("now()"),
      nullable=False,
    ),
    sa.Column(
      "updated_at",
      postgresql.TIMESTAMP(timezone=True),
      server_default=sa.text("now()"),
      nullable=False,
    ),
  )

  # Re-create subscribers table
  op.create_table(
    "subscribers",
    sa.Column("id", sa.UUID(), primary_key=True, nullable=False),
    sa.Column("email", sa.VARCHAR(length=255), nullable=False),
    sa.Column(
      "created_at",
      postgresql.TIMESTAMP(timezone=True),
      server_default=sa.text("now()"),
      nullable=False,
    ),
  )

  # Unique index on subscribers.email
  op.create_index(
    op.f("ix_subscribers_email"),
    "subscribers",
    ["email"],
    unique=True,
  )


def downgrade() -> None:
  """Downgrade schema.

  Reverse of upgrade: drop tables and index.
  """

  op.drop_index(op.f("ix_subscribers_email"), table_name="subscribers")
  op.drop_table("subscribers")
  op.drop_table("testimonials")
