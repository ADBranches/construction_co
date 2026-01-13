⚠️ **This timeline is based 100% on our actual project structure** (backend + frontend), 

⚠️ **Each phase lists EXACT files to edit or create**
⚠️ **Includes test coverage expectations**
⚠️ **Phases are incremental and safe — nothing breaks existing green tests**

---

# 🧭 **FULL-STACK IMPLEMENTATION TIMELINE — SUPER_USER ADMIN SYSTEM**

---

# ✅ **PHASE 1 — Strengthen Authentication & SuperUser Role Wiring**

### 🎯 Goal: Frontend and backend must fully understand admin vs non-admin.

### **Backend — Files to Modify**

| File                  | Purpose                               |
| --------------------- | ------------------------------------- |
| `app/schemas/auth.py` | Ensure `is_superuser` is in `UserOut` |
| `app/api/v1/auth.py`  | Confirm `/auth/me` returns role       |
| `app/dependencies.py` | Keep `get_current_admin()` correct    |

### **Frontend — Files to Modify**

| File                                          | Purpose                                |
| --------------------------------------------- | -------------------------------------- |
| `src/lib/auth.js`                             | Fetch `/auth/me`, store `is_superuser` |
| `src/components/layout/useRequireAdmin.js`    | Redirect non-admin users               |
| `src/components/layout/Navbar.jsx` (optional) | Hide admin links if not admin          |
| `src/pages/admin/AdminLogin.jsx`              | Update login to store role             |

### **Tests to Add / Expand**

| File                                   | Test Purpose                                |
| -------------------------------------- | ------------------------------------------- |
| `backend/tests/test_auth_rbac.py`      | Add test: `/auth/me` returns `is_superuser` |
| `frontend/src/__tests__/auth.test.jsx` | Login should store token + is_superuser     |

---

# ✅ **PHASE 2 — Admin Dashboard Foundation**

### 🎯 Goal: Build dashboard KPIs powered by backend `/stats` endpoints.

### **Backend — Files to Modify**

| File                  | Purpose                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------- |
| `app/api/v1/stats.py` | Ensure endpoints return: counts for services, projects, inquiries, testimonials, subscribers |
| `app/services/*`      | Add helper count functions if needed                                                         |
| `app/main.py`         | Mount `/api/v1/stats` router                                                                 |

### **Frontend — Files to Modify**

| File                                 | Purpose                            |
| ------------------------------------ | ---------------------------------- |
| `src/components/admin/StatCard.jsx`  | Ensure consistent display of KPIs  |
| `src/pages/admin/AdminDashboard.jsx` | Connect to `/api/v1/stats`         |
| `src/components/admin/Sidebar.jsx`   | Ensure proper dashboard navigation |

### **Tests**

| File                                        | Purpose                               |
| ------------------------------------------- | ------------------------------------- |
| `backend/tests/test_stats_endpoints.py`     | Expand to test all KPIs               |
| `frontend/src/__tests__/Dashboard.test.jsx` | Dashboard renders KPI cards correctly |

---

# ✅ **PHASE 3 — Services Management (CRUD CMS)**

### 🎯 Goal: Backend + Admin UI for services.

### **Backend — Files to Modify**

| File                                          | Purpose                              |
| --------------------------------------------- | ------------------------------------ |
| `app/api/v1/services.py`                      | CRUD admin protection                |
| `app/models/service.py`                       | Confirm all fields exist             |
| `app/schemas/service.py`                      | Input/output validation              |
| `app/services/service_service.py` (if exists) | Add helpers for create/update/delete |

### **Frontend — Files to Modify**

| File                                | Purpose                      |
| ----------------------------------- | ---------------------------- |
| `src/pages/admin/AdminServices.jsx` | List, edit, delete services  |
| `src/components/ServiceCard.jsx`    | Display services             |
| `src/lib/api.js`                    | Add service CRUD endpoints   |
| `src/components/ui/Modal.jsx`       | Service creation / edit form |

### **Tests**

| File                                            | Purpose                        |
| ----------------------------------------------- | ------------------------------ |
| `backend/tests/test_services_basic.py`          | Test CRUD & auth restrictions  |
| `frontend/src/__tests__/ServicesAdmin.test.jsx` | Ensure admin can CRUD services |

---

# ✅ **PHASE 4 — Projects Management (Portfolio CMS)**

### 🎯 Goal: Add full control of projects.

### **Backend — Files to Modify**

| File                     | Purpose                       |
| ------------------------ | ----------------------------- |
| `app/api/v1/projects.py` | CRUD endpoints +              |
| admin restrictions       |                               |
| `app/models/project.py`  | Ensure relationships & fields |
| `app/schemas/project.py` | Validation                    |
| `app/api/v1/media.py`    | Project media handling        |

### **Frontend — Files to Modify**

| File                                   | Purpose                  |
| -------------------------------------- | ------------------------ |
| `src/pages/admin/AdminProjects.jsx`    | List + filters           |
| `src/pages/admin/AdminProjectEdit.jsx` | Form for editing project |
| `src/components/ProjectCard.jsx`       | Public-facing view       |
| `src/lib/api.js`                       | Add project endpoints    |

### **Tests**

| File                                            | Purpose                 |
| ----------------------------------------------- | ----------------------- |
| `backend/tests/test_projects_basic.py`          | CRUD + permission tests |
| `frontend/src/__tests__/ProjectsAdmin.test.jsx` | Admin CRUD flow tests   |

---

# ✅ **PHASE 5 — Inquiries Management (Mini CRM)**

### 🎯 Goal: Admin sees inquiries, updates status, adds notes.

### **Backend — Files to Modify**

| File                      | Purpose                            |
| ------------------------- | ---------------------------------- |
| `app/api/v1/inquiries.py` | Admin list, status update, filters |
| `app/models/inquiry.py`   | Add fields for notes (optional)    |
| `app/schemas/inquiry.py`  | Return all required fields         |

### **Frontend — Files to Modify**

| File                                      | Purpose                           |
| ----------------------------------------- | --------------------------------- |
| `src/pages/admin/AdminInquiries.jsx`      | Table showing inquiries           |
| `src/components/admin/InquiriesTable.jsx` | Implementation of list + filters  |
| `src/lib/api.js`                          | Add endpoints for update & filter |

### **Tests**

| File                                             | Purpose                      |
| ------------------------------------------------ | ---------------------------- |
| `backend/tests/test_inquiries_admin.py`          | Status updates, list filters |
| `frontend/src/__tests__/InquiriesAdmin.test.jsx` | UI/behavior of table         |

---

# ✅ **PHASE 6 — Testimonials Management**

### 🎯 Goal: CMS for testimonials.

### **Backend — Files (Already Exist) — Modify Slightly**

| File                         |
| ---------------------------- |
| `app/api/v1/testimonials.py` |
| `app/models/testimonial.py`  |
| `app/schemas/testimonial.py` |

### **Frontend — Files to Modify**

| File                                                      |
| --------------------------------------------------------- |
| `src/components/Testimonials.jsx`                         |
| `src/pages/admin/AdminTestimonials.jsx` (create new file) |
| `src/lib/api.js`                                          |

### **Tests**

| Backend                            |
| ---------------------------------- |
| `tests/test_testimonials_basic.py` |

| Frontend                               |
| -------------------------------------- |
| `__tests__/TestimonialsAdmin.test.jsx` |

---

# ✅ **PHASE 7 — Subscribers (Newsletter)**

### 🎯 Goal: Super_user can view subscriber list.

### Backend files:

| File                        |
| --------------------------- |
| `app/api/v1/subscribers.py` |

Frontend files:

| File                                   |
| -------------------------------------- |
| `src/pages/admin/AdminSubscribers.jsx` |
| `src/components/admin/Table.jsx`       |

Tests:

| File                                               |
| -------------------------------------------------- |
| `backend/tests/test_subscribers_admin.py`          |
| `frontend/src/__tests__/SubscribersAdmin.test.jsx` |

---

# ✅ **PHASE 8 — Admin User Management (Later Feature)**

### 🎯 Goal: Promote/demote staff/admin.

Backend:

| File                  |
| --------------------- |
| `app/api/v1/users.py` |
| `app/models/user.py`  |
| `app/schemas/user.py` |

Frontend:

| File                             |
| -------------------------------- |
| `src/pages/admin/AdminUsers.jsx` |
| `src/lib/api.js`                 |

Tests:

| File                       |
| -------------------------- |
| `tests/test_users_rbac.py` |

---

# 🎯 **TOTAL OUTCOME: FULL STACK SUPER_USER SYSTEM**

Once all phases are implemented:

✔ Admin can manage content (services, projects)
✔ Admin can manage user submissions (inquiries, subscribers)
✔ Admin sees business KPIs (stats dashboard)
✔ Admin manages social proof (testimonials)
✔ Admin has access to internal tools (media, user management)
✔ All admin APIs protected by strong backend RBAC
✔ Frontend prevents unauthorized access with route guards
✔ All features covered by backend + frontend tests

---
