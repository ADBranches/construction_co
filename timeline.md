Below is a **phase-based development timeline** that:

* Focuses on *features & behavior* first
* Names **roles**, **files**, and **directories** explicitly
* Covers everything needed for a modern, standard, international-grade site (without crazy over-engineering)

---

## Phase 1 – Domain Models & API Foundations

**Goal:** Make sure the backend fully expresses the business: services, projects, inquiries, media, users + roles.

### Backend Dev

* **Models (refine/confirm fields)**

  * `app/models/service.py` – service categories, bullets, icon, is_featured.
  * `app/models/project.py` – title, slug, service_id (FK), location, dates, summary, details, status, hero_media_id.
  * `app/models/media.py` – url, alt_text, type, category.
  * `app/models/inquiry.py` – full_name, email, phone, source (`contact`, `quote`), service_type, budget_range, message, status (`new`, `in_review`, `contacted`, `proposal_sent`, `won`, `lost`), assigned_to_id.
  * `app/models/user.py` – name, email, password_hash, **role** (`admin`, `staff`), is_active, created_at.

* **Schemas (mirror models)**

  * `app/schemas/service.py`
  * `app/schemas/project.py`
  * `app/schemas/media.py`
  * `app/schemas/inquiry.py`
  * `app/schemas/user.py`

* **Migrations**

  * Update Alembic `migrations/versions/xxxx_initial_schema.py` (or create new revision) to match the above.
  * Run `alembic upgrade head`.

* **API contracts (ensure all basic CRUD exist)**

  * `app/api/v1/services.py` → `GET /services`, `GET /services/{id}`, `POST/PUT/DELETE` (admin).
  * `app/api/v1/projects.py` → list, detail, filter by service, create/update/delete (admin).
  * `app/api/v1/media.py` → list, create, soft delete.
  * `app/api/v1/inquiries.py` →

    * `POST /inquiries` (public create from web forms)
    * `GET /inquiries` (admin list with filters)
    * `PATCH /inquiries/{id}` (update status, assign_to, add internal note).

* **Infrastructure glue**

  * Ensure `app/main.py` includes routers for all `api/v1/*.py`.
  * Confirm DB session handling in `app/database.py` and DI in `app/dependencies.py`.

### Product/Content

* Finalize controlled vocabularies:

  * Service categories (exact names used in DB).
  * Inquiry statuses & project statuses.

---

## Phase 2 – Public Site Fully Data-Driven

**Goal:** No hard-coded business content; all key sections read from the API.

### Frontend Dev

* **Wire pages to API via `src/lib/apiClient.js` / `src/lib/api.js`**

  * `src/pages/Home.jsx`

    * Fetch featured services (`GET /api/v1/services?featured=true`).
    * Fetch homepage stats (can come from `GET /api/v1/projects/stats` or static for now).
  * `src/pages/Services.jsx`

    * Replace hard-coded cards with API data from `GET /api/v1/services`.
    * Use `ServiceCard.jsx` as reusable component.
  * `src/pages/Projects.jsx`

    * Fetch list `GET /api/v1/projects` with filters (service, year).
    * Use `ProjectCard.jsx` for each project.
  * Optional: create `src/pages/ProjectDetail.jsx`

    * Route `/projects/:slug` pulling from `GET /api/v1/projects/{slug}`.

* **Quote & Contact forms → inquiries API**

  * `src/pages/Quote.jsx` → `POST /api/v1/inquiries` with `source: "quote"`.
  * `src/pages/Contact.jsx` → `POST /api/v1/inquiries` with `source: "contact"`.

* **SEO component**

  * `src/seo/Seo.jsx` – per page `<title>` and meta description; standard defaults for Home, Services, Projects, About, Contact.

### Backend Dev

* Add helper endpoints used above if missing:

  * `GET /api/v1/projects/stats` (total projects, years of experience, etc.)
  * `GET /api/v1/projects/{slug}` if you go slug-based.

### Product/Content

* Confirm copy and meta descriptions per page (will be used in `Seo.jsx`).

---

## Phase 3 – Authentication & RBAC

**Goal:** Secure admin area with clean roles and permissions.

### Backend Dev

* **User roles**

  * Update `app/models/user.py` with `role` field (enum: `admin`, `staff`).
  * If needed, add simple `Role` / `Permission` tables later; for now keep role enum.

* **Auth service**

  * `app/services/auth_service.py` – functions to:

    * Register staff user (admin only).
    * Authenticate user and issue JWT.

* **Auth utilities**

  * `app/utils/jwt_handler.py` – issue/verify tokens, expiry.
  * `app/utils/hashing.py` – password hashing.

* **Auth API**

  * `app/api/v1/auth.py`:

    * `POST /auth/login` → returns access token.
    * `GET /auth/me` → returns user info & role (for frontend).
    * `POST /auth/users` → create staff/admin (protected by admin role).

* **RBAC middleware & dependencies**

  * `app/middlewares/auth_middleware.py` → verify JWT, attach `user` to request context.
  * In `app/dependencies.py`:

    * `get_current_user`
    * `require_role(["admin", "staff"])`
    * (optional) `require_admin`.

* **Secure admin endpoints**

  * In `app/api/v1/inquiries.py`, `services.py`, `projects.py`, `media.py`, `users.py`:

    * Add dependencies requiring auth and appropriate role for create/update/delete operations.

### Frontend Dev

* **Auth library**

  * `src/lib/auth.js`:

    * `login(credentials)` calls `/api/v1/auth/login`.
    * `getCurrentUser()` calls `/api/v1/auth/me`.
    * Handle token storage (localStorage or httpOnly cookie depending on backend).

* **Auth context**

  * Create `src/lib/AuthContext.jsx` (or similar) to hold `user`, `role`, `isAuthenticated`.

* **Protected routes**

  * Update `src/components/layout/useRequireAdmin.js` → more generic `useRequireAuth` / `useRequireRole` that:

    * Checks `role` from context.
    * Redirects unauthenticated users to `pages/admin/AdminLogin.jsx`.

* **Admin login & layout**

  * `src/pages/admin/AdminLogin.jsx` – fully wired to `auth.js`.
  * `src/components/layout/AdminLayout.jsx` – uses auth context, shows logout, role-based sidebar.

### QA / Tester

* Simple manual flows:

  * Unauthenticated user blocked from `/admin` pages.
  * Staff vs admin: admin can access user management; staff cannot.

---

## Phase 4 – Admin CMS for Services, Projects, Inquiries, Media

**Goal:** Non-developers can manage website content; staff can work inquiries like a mini CRM.

### Backend Dev

* Ensure all needed endpoints exist & are role-protected:

  * `app/api/v1/services.py` – full CRUD.
  * `app/api/v1/projects.py` – full CRUD + search/filter.
  * `app/api/v1/media.py` – upload/attach (you can start with URL-only, no file upload yet).
  * `app/api/v1/inquiries.py` – list, filter by status, update status/assignment, add note.

### Frontend Dev

Using existing admin components:
`src/components/admin/InquiriesTable.jsx`, `Sidebar.jsx`, `StatCard.jsx`, `Topbar.jsx`
`src/components/ui/Modal.jsx`, `Table.jsx`

* **Admin dashboard**

  * `src/pages/admin/AdminDashboard.jsx`

    * Pull stats from `GET /api/v1/projects/stats`, `GET /api/v1/inquiries/stats`.
    * Show `StatCard` components for projects, open inquiries, etc.

* **Inquiries management**

  * `src/pages/admin/AdminInquiries.jsx` + `InquiriesTable.jsx`

    * Use `Table.jsx` to render inquiries from `GET /api/v1/inquiries?status=new`.
    * Add controls (dropdown, buttons) to:

      * Change status.
      * Assign to staff.
      * Open `Modal.jsx` for detailed view & internal notes.

* **Services management**

  * `src/pages/admin/AdminServices.jsx`

    * List services via `GET /api/v1/services`.
    * Create/edit forms using `Input.jsx` and `Modal.jsx`.
    * Toggle “featured” flag.

* **Projects management**

  * `src/pages/admin/AdminProjects.jsx` – list / filter.
  * `src/pages/admin/AdminProjectEdit.jsx` – create/edit project:

    * Choose service from dropdown loaded from `GET /services`.
    * Select hero media (or paste URL).
    * Publish/unpublish.

* **Media listing (optional at first)**

  * Could be part of Projects form or a separate `AdminMedia.jsx` later.

### QA / Tester

* Verify that:

  * Creating service/project in admin shows up correctly on public `Services.jsx` / `Projects.jsx`.
  * Inquiry status changes reflect in the table and are persisted.

---

## Phase 5 – Client-Facing Extras (Testimonials, Partners, Subscribers)

**Goal:** Add the “international polish” features.

### Backend Dev

* New models & schemas:

  * `app/models/testimonial.py` – name, role, company, quote, is_featured.
  * `app/models/subscriber.py` – email, created_at.
* Endpoints:

  * `app/api/v1/testimonials.py` – public list + admin CRUD.
  * `app/api/v1/subscribers.py` – `POST /subscribers` (public), `GET /subscribers` (admin).

### Frontend Dev

* `src/components/Testimonials.jsx` (or section in `Home.jsx`) pulling from `/api/v1/testimonials`.
* Footer newsletter form (`Stay Updated` in existing layout) posting to `/api/v1/subscribers`.

---

## Phase 6 – Automated Testing (Logic Protection)

**Goal:** Basic safety net around all important logic.

### Backend Dev / QA

* Add `tests/` at backend root:

  * `tests/test_services_api.py` – CRUD flow.
  * `tests/test_projects_api.py` – list, filter, detail.
  * `tests/test_inquiries_api.py` – create inquiry (public), list/update (admin, requires auth).
  * `tests/test_auth_rbac.py` – ensure staff/admin behavior & unauthorized responses.

* Use pytest + HTTPX/`TestClient` against `app.main`.

### Frontend Dev / QA

* Add `src/__tests__/`:

  * `src/__tests__/Home.test.jsx` – renders hero, services fetched (mock API).
  * `src/__tests__/Quote.test.jsx` – form validation & submit calls `apiClient.post`.
  * `src/__tests__/AdminLogin.test.jsx` – successful login sets auth context and redirects.
  * `src/__tests__/AdminInquiries.test.jsx` – list inquiries & change status (mock API).

* Ensure `package.json` has `"test": "vitest --run"` and vitest setup (jsdom, etc.).

---

## Phase 7 – DevOps & Documentation

**Goal:** Make it easy to run, deploy, and maintain like a real product.

### DevOps / Backend / Frontend

* **Docs**

  * Root `README.md` – overview + “quick start” for backend and frontend.
  * `backend/README.md` – env vars, migrations, running tests, API docs (`/docs`).
  * `frontend/README.md` – env vars, dev server, tests.
  * `docs/architecture.md` – brief diagram: React (frontend) → FastAPI (backend) → DB.

* **Env management**

  * `.env.example` in `backend/` and `frontend/` with all required variables.

* **CI basics (GitHub Actions)**

  * `/.github/workflows/backend-ci.yml` – install deps, run `pytest`.
  * `/.github/workflows/frontend-ci.yml` – `npm ci`, `npm run lint`, `npm test`.

* **Optional Docker**

  * `backend/Dockerfile` – build FastAPI image.
  * `frontend/Dockerfile` – build React app.
  * `docker-compose.yml` with `backend`, `frontend`, `db` for local “production-like” runs.

---

If you’d like, next step I can take **Phase 3 (Auth & RBAC)** and write the concrete changes for:

* `app/models/user.py`
* `app/api/v1/auth.py`
* `app/middlewares/auth_middleware.py`
* `src/lib/auth.js`
* `src/components/layout/useRequireAdmin.js`

so you can start implementing that phase immediately.

