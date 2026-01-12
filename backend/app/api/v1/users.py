from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_admin
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["Users"])


# =====================================================
# LIST USERS (ADMIN)
# =====================================================
@router.get("", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    """
    Admin: List all users.
    """
    return db.query(User).all()


# =====================================================
# GET SINGLE USER (ADMIN)
# =====================================================
@router.get("/{user_id}", response_model=UserOut)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user
