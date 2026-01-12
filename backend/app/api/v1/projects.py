from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.dependencies import get_db, get_current_admin
from app.models.project import Project, ProjectStatus
from app.models.service import Service
from app.schemas.project import (
    ProjectOut,
    ProjectCreate,
    ProjectUpdate,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


# =====================================================
# LIST PROJECTS (PUBLIC)
# =====================================================
@router.get("", response_model=dict)
def list_projects(
    db: Session = Depends(get_db),

    # Pagination
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),

    # Filters
    status: ProjectStatus | None = Query(None),
    service_slug: str | None = Query(None),
    featured: bool | None = Query(None),

    # Sorting
    sort: str | None = Query(
        None,
        description="Sort by: newest | oldest | featured",
    ),
):
    """
    Public: List projects with filtering, sorting, and pagination.
    """

    query = db.query(Project)

    # ---------- Filters ----------
    if status is not None:
        query = query.filter(Project.status == status)

    if featured is not None:
        query = query.filter(Project.is_featured == featured)

    if service_slug:
        query = (
            query.join(Service, Project.service_id == Service.id)
            .filter(Service.slug == service_slug)
        )

    # ---------- Sorting ----------
    if sort == "newest":
        query = query.order_by(Project.created_at.desc())
    elif sort == "oldest":
        query = query.order_by(Project.created_at.asc())
    elif sort == "featured":
        query = query.order_by(
            Project.is_featured.desc(),
            Project.created_at.desc(),
        )
    else:
        query = query.order_by(Project.created_at.desc())

    # ---------- Pagination ----------
    total = query.count()
    items = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items,
    }


# =====================================================
# GET SINGLE PROJECT (PUBLIC)
# =====================================================
@router.get("/{slug}", response_model=ProjectOut)
def get_project_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .options(
            joinedload(Project.service),
            joinedload(Project.media_items),
        )
        .filter(Project.slug == slug)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    return project


# =====================================================
# CREATE PROJECT (ADMIN)
# =====================================================
@router.post("", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already in use.",
        )

    project = Project(**project_in.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


# =====================================================
# UPDATE PROJECT (ADMIN)
# =====================================================
@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


# =====================================================
# DELETE PROJECT (ADMIN)
# =====================================================
@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found.",
        )

    db.delete(project)
    db.commit()
    return None
