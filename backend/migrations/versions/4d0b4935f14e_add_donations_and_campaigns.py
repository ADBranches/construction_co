"""add donations and campaigns

Revision ID: 4d0b4935f14e
Revises: 4ccd182b0b9b
Create Date: 2026-01-23 05:58:45.601905

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "4d0b4935f14e"
down_revision: Union[str, Sequence[str], None] = "4ccd182b0b9b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # CAMPAIGNS TABLE
    op.create_table(
        "campaigns",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("slug", sa.String(length=200), nullable=False),
        sa.Column("short_description", sa.String(length=300), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "currency",
            sa.String(length=3),
            nullable=False,
            server_default="UGX",
        ),
        sa.Column("target_amount", sa.Integer(), nullable=True),
        sa.Column(
            "raised_amount",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column(
            "status",
            sa.Enum(
                "DRAFT",
                "ACTIVE",
                "CLOSED",
                "ARCHIVED",
                name="campaign_status",
            ),
            nullable=False,
            server_default="ACTIVE",
        ),
        sa.Column(
            "is_featured",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column(
            "sort_order",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column("hero_image_url", sa.String(length=500), nullable=True),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_campaigns_id"), "campaigns", ["id"], unique=False)
    op.create_index(op.f("ix_campaigns_slug"), "campaigns", ["slug"], unique=True)

    # DONATIONS TABLE
    op.create_table(
        "donations",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column(
            "currency",
            sa.String(length=3),
            nullable=False,
            server_default="UGX",
        ),
        sa.Column(
            "status",
            sa.Enum(
                "PENDING",
                "CONFIRMED",
                "FAILED",
                "REFUNDED",
                name="donation_status",
            ),
            nullable=False,
            server_default="PENDING",
        ),
        sa.Column("donor_name", sa.String(length=150), nullable=True),
        sa.Column("donor_email", sa.String(length=255), nullable=True),
        sa.Column("donor_phone", sa.String(length=50), nullable=True),
        sa.Column(
            "is_anonymous",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("campaign_id", sa.UUID(), nullable=True),
        sa.Column("payment_method", sa.String(length=50), nullable=True),
        sa.Column("payment_provider", sa.String(length=50), nullable=True),
        sa.Column("provider_payment_id", sa.String(length=100), nullable=True),
        sa.Column("provider_customer_id", sa.String(length=100), nullable=True),
        sa.Column("provider_status", sa.String(length=50), nullable=True),
        sa.Column("card_brand", sa.String(length=30), nullable=True),
        sa.Column("card_last4", sa.String(length=4), nullable=True),
        sa.Column("card_exp_month", sa.Integer(), nullable=True),
        sa.Column("card_exp_year", sa.Integer(), nullable=True),
        sa.Column("ip_address", sa.String(length=45), nullable=True),
        sa.Column("user_agent", sa.String(length=300), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.ForeignKeyConstraint(
            ["campaign_id"],
            ["campaigns.id"],
            ondelete="SET NULL",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_donations_campaign_id"),
        "donations",
        ["campaign_id"],
        unique=False,
    )
    op.create_index(op.f("ix_donations_id"), "donations", ["id"], unique=False)
    # op.create_index("ix_donations_status", "donations", ["status"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""

    # op.drop_index("ix_donations_status", table_name="donations")
    op.drop_index(op.f("ix_donations_id"), table_name="donations")
    op.drop_index(op.f("ix_donations_campaign_id"), table_name="donations")
    op.drop_table("donations")

    op.drop_index(op.f("ix_campaigns_slug"), table_name="campaigns")
    op.drop_index(op.f("ix_campaigns_id"), table_name="campaigns")
    op.drop_table("campaigns")
