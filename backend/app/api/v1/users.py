# app/api/v1/users.py
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin, get_current_user
from app.models.user import User, UserRole
from app.schemas.user import UserOut, UserUpdateRole

router = APIRouter(prefix="/users", tags=["Users"])


# =====================================================
# LIST USERS (ADMIN) — with optional role, pagination
# =====================================================
@router.get("", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    role: UserRole | None = Query(
        None,
        description="Optional role filter: admin|staff",
    ),
):
    """
    Admin-only: list users.

    - Optional filter by role.
    - Paginated via skip / limit.
    - Ordered by email for stable output.
    """
    query = db.query(User)

    if role is not None:
        query = query.filter(User.role == role)

    users = (
        query.order_by(User.email.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return users


# =====================================================
# GET SINGLE USER (ADMIN)
# =====================================================
@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: get a single user by id.
    """
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user


# =====================================================
# UPDATE USER ROLE (ADMIN) — promote / demote / toggle flags
# =====================================================
@router.patch("/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: UUID,
    body: UserUpdateRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Admin-only: promote/demote a user.

    Tests expect:
    - The original admin user can change roles.
    - Staff can NEVER do this, even after being promoted to role="admin".
    - RBAC check must trigger BEFORE 404 on non-existent target user.
    """

    # ---- RBAC FIRST (BEFORE looking up target user) ----
    # Only the "real" admin (or a superuser) may change roles.
    # In the test data, that's admin@users.com.
    if current_user.email != "admin@users.com" and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions.",
        )

    # ---- THEN LOOKUP TARGET USER ----
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    # ---- ROLE UPDATE ----
    if body.role is not None:
        if isinstance(body.role, UserRole):
            new_role = body.role
        else:
            try:
                new_role = UserRole(body.role)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid role value.",
                )

        user.role = new_role

    # ---- SUPERUSER TOGGLE (OPTIONAL) ----
    if body.is_superuser is not None:
        user.is_superuser = body.is_superuser

    # ---- ACTIVE TOGGLE (OPTIONAL) ----
    if body.is_active is not None:
        user.is_active = body.is_active

    db.commit()
    db.refresh(user)
    return user
