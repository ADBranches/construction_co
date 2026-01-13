# backend/tests/test_models_basic.py
import uuid

from app.database import SessionLocal, Base, engine
from app.models import Service, Project, Inquiry, User, Media
from app.models.inquiry import InquiryStatus


def setup_module():
  """
  Ensure tables exist before tests run.
  We don't drop anything here so we don't wipe dev data by accident.
  """
  Base.metadata.create_all(bind=engine)


def teardown_module():
  """
  For now we leave data in place. If you later use a dedicated test DB,
  you can uncomment the drop_all line to reset between runs.
  """
  # Base.metadata.drop_all(bind=engine)
  pass


def test_create_user():
  db = SessionLocal()

  email = f"test+{uuid.uuid4().hex[:8]}@example.com"

  user = User(
      email=email,
      full_name="Test User",
      hashed_password="fake-hash",
  )
  db.add(user)
  db.commit()
  db.refresh(user)

  assert user.id is not None
  assert user.hashed_password is not None

  db.close()


def test_create_service_and_project():
  db = SessionLocal()

  suffix = uuid.uuid4().hex[:8]
  service_name = f"Design & Build {suffix}"
  service_slug = f"design-build-{suffix}"

  service = Service(
      name=service_name,
      slug=service_slug,
  )
  db.add(service)
  db.commit()
  db.refresh(service)

  project = Project(
      name=f"Test Project {suffix}",
      slug=f"test-project-{suffix}",
      service_id=service.id,
  )
  db.add(project)
  db.commit()
  db.refresh(project)

  assert project.id is not None
  assert project.service_id == service.id

  db.close()


def test_create_inquiry_with_assignment():
  db = SessionLocal()

  staff_email = f"sales+{uuid.uuid4().hex[:8]}@example.com"

  user = User(
      email=staff_email,
      full_name="Sales Staff",
      hashed_password="fake-hash",
  )
  db.add(user)
  db.commit()
  db.refresh(user)

  client_email = f"client+{uuid.uuid4().hex[:8]}@example.com"

  inquiry = Inquiry(
      full_name="Client A",
      email=client_email,
      status=InquiryStatus.NEW,
      assigned_to_id=user.id,
  )
  db.add(inquiry)
  db.commit()
  db.refresh(inquiry)

  assert inquiry.id is not None
  assert inquiry.status == InquiryStatus.NEW
  assert inquiry.assigned_to_id == user.id

  db.close()
