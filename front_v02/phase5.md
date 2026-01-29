We’re *not* changing behaviour yet — just marking the plan + mapping where each feature will move.

---

## 5.1 Mark API layers as “legacy / to be removed”

Add a short banner comment at the top of both files.
(This doesn’t change behaviour; it just encodes the plan in the repo.)

### `src/lib/apiClient.js` (add at very top)

```js
// ⚠️ LEGACY NETWORK LAYER
// In front_v02 we are moving to a frontend-only architecture.
// All new features should use the *Store* modules (servicesStore, projectsStore, etc.)
// instead of calling this API client. Existing usages will be migrated feature-by-feature.
```

### `src/lib/api.js` (add at very top)

```js
// ⚠️ LEGACY DOMAIN API (BACKEND-BOUND)
// In front_v02 we are migrating to frontend-only Stores:
// - ServicesStore, ProjectsStore, TestimonialsStore, InquiriesStore, SubscribersStore,
//   UsersStore, CampaignsStore, DonationsStore.
// Public + admin UIs will be refactored to call Stores directly.
// Once everything is Store-based, this module will either be removed
// or turned into thin wrappers around the Stores.
```

That’s it for code changes in Phase 5 right now.

---

## 5.2 Decide **migration order** in *your* repo

We keep the **same high-level order**, but let’s pin it to your actual files/tests so you can tick them off.

### Phase 5 – Migration order (for THIS repo)

We always do:

1. **Public pages first** (read-only, no auth).
2. **Admin pages for that domain.**
3. **Tests for that domain.**
4. Then move to the next domain.

---

### 🔹 1. Services (first vertical)

**Target stores / data:**

* `src/data/servicesData.js`
* `src/lib/servicesStore.js`

**Files to migrate later:**

* Public:

  * `src/pages/Home.jsx`      → featured services from `ServicesStore.getFeatured()`
  * `src/pages/Services.jsx`  → list from `ServicesStore.list()`
  * `src/pages/ServiceDetail.jsx` → `ServicesStore.getBySlug(slug)`
* Admin:

  * `src/pages/admin/AdminServices.jsx` → CRUD via `ServicesStore`
* Tests:

  * `src/__tests__/Services.test.jsx`
  * `src/__tests__/ServicesAdmin.test.jsx`

**Current likely state:**

* Some of these still use `ServiceAPI` or direct `apiClient`/`fetch`.
* Tests probably mock network.

**Planned migration steps (for when you’re ready to actually change code):**

1. **Public Services → Stores**

   * Replace any `ServiceAPI.list()` / direct API usage with `ServicesStore` methods.
   * If you want, you can go via a tiny hook: `useServices()` that internally calls `ServicesStore.list()`.

2. **AdminServices → Stores**

   * Replace create/update/delete flows to use `ServicesStore.create/update/remove`.
   * Keep state & UI the same.

3. **Tests → mock `ServicesStore` instead of API**

   * In tests, `vi.mock("../lib/servicesStore", ...)` (path adjusted to where you import from).
   * Assert UI behaviour the same as before.

✅ Once this vertical is done, you’ll have a full **pattern** for Projects, Testimonials, etc.

---

### 🔹 2. Projects

**Target:**

* `src/data/projectsData.js`
* `src/lib/projectsStore.js`

**Files later:**

* Public:

  * `src/pages/Projects.jsx`
  * `src/pages/ProjectDetail.jsx`
  * `src/pages/Home.jsx` (featured projects)
* Admin:

  * `src/pages/admin/AdminProjects.jsx`
* Tests:

  * `src/__tests__/ProjectsAdmin.test.jsx`
  * Possibly `Dashboard.test.jsx` if it shows project stats.

Plan mirrors Services:

1. Public pages → `ProjectsStore.list/getBySlug/getFeatured`
2. AdminProjects → `ProjectsStore`
3. Tests → mock `ProjectsStore`

---

### 🔹 3. Testimonials

**Target:**

* `src/data/testimonialsData.js`
* `src/lib/testimonialsStore.js`

**Files:**

* Public:

  * `src/components/Testimonials.jsx`
* Admin:

  * `src/pages/admin/AdminTestimonials.jsx`
* Tests:

  * `src/__tests__/TestimonialsAdmin.test.jsx`

Plan:

1. Public Testimonials → `TestimonialsStore.listPublic()`
2. AdminTestimonials → `TestimonialsStore.listAll/create/update/remove`
3. Tests → mock `TestimonialsStore`

---

### 🔹 4. Quote / Inquiries

**Target:**

* `src/data/inquiriesData.js`
* `src/lib/inquiriesStore.js`

**Files:**

* Public:

  * `src/pages/Quote.jsx` (and maybe `Contact.jsx` if it posts inquiries)
* Admin:

  * `src/pages/admin/AdminInquiries.jsx`
* Tests:

  * `src/__tests__/InquiriesAdmin.test.jsx`
  * Possibly `Quote.test.jsx` if it touched API.

Plan:

1. Public forms → `InquiriesStore.create(...)`
2. AdminInquiries → `InquiriesStore.list/listByStatus/update/updateStatus`
3. Tests → mock `InquiriesStore`

---

### 🔹 5. Subscribers (Newsletter)

**Target:**

* `src/data/subscribersData.js`
* `src/lib/subscribersStore.js`

**Files:**

* Public:

  * `src/components/FooterNewsletter.jsx`
* Admin:

  * `src/pages/admin/AdminSubscribers.jsx`
* Tests:

  * `src/__tests__/SubscribersAdmin.test.jsx`

Plan:

1. Newsletter form → `SubscribersStore.add(email)`
2. AdminSubscribers → `SubscribersStore.list/removeById`
3. Tests → mock `SubscribersStore`

---

### 🔹 6. Users / RBAC (frontend demo)

**Target:**

* `src/data/usersData.js`
* `src/lib/usersStore.js`

**Files:**

* Admin:

  * `src/pages/admin/AdminUsers.jsx`
  * `src/components/layout/useRequireAdmin.js` (indirectly via `auth.js`)
  * `src/pages/admin/AdminLogin.jsx` (front-only login)
* Tests:

  * `src/__tests__/UsersAdmin.test.jsx`
  * `src/__tests__/auth.test.jsx`

Plan:

1. **Auth front-only** (this is more Phase 7 but good to mark here):

   * `auth.js` uses `UsersStore` and localStorage instead of hitting backend.
2. AdminUsers → `UsersStore.list/updateRole`
3. Tests → mock `UsersStore` and `auth` helpers.

---

### 🔹 7. Campaigns & Donations (heaviest)

**Target:**

* `src/data/campaignsData.js`
* `src/data/donationsData.js`
* `src/lib/campaignsStore.js`
* `src/lib/donationsStore.js`

**Files:**

* Public Donate flow:

  * `src/pages/Donate.jsx`
  * `src/components/donations/DonateButton.jsx`
  * `src/components/donations/DonationForm.jsx`
  * `src/components/donations/DonationSuccess.jsx`
  * `src/components/donations/DonationFailure.jsx`
  * `src/components/donations/DonationSummary.jsx`
* Admin:

  * `src/pages/admin/AdminCampaigns.jsx`
  * `src/pages/admin/AdminDonations.jsx`
  * `src/components/admin/DashboardDonationsWidget.jsx`
* Tests:

  * `src/__tests__/Donate.test.jsx`
  * `src/__tests__/DonateButton.test.jsx`
  * `src/__tests__/AdminCampaigns.test.jsx`
  * `src/__tests__/AdminDonations.test.jsx`
  * `src/__tests__/DashboardDonationsWidget.test.jsx`
  * `src/__tests__/Dashboard.test.jsx` (if using donation stats).

Plan:

1. Public Donate path:

   * campaigns → `CampaignsStore.getActive/list`
   * when “pay” → call `DonationsStore.create(...)` with a fake “paid” status.
2. AdminCampaigns → CRUD via `CampaignsStore`
3. AdminDonations + widgets:

   * Reads via `DonationsStore.filterDonations(...)` + `CampaignsStore` lookups.
4. Tests → mock both `CampaignsStore` and `DonationsStore`.

---

## 5.3 Simple checklist you can keep in the repo

If you want, drop this as a comment block into e.g. `README.md` (dev section) or a `docs/front-only-migration.md`:

```md
### Front-only Migration Checklist

[ ] Services → ServicesStore (Home, Services, ServiceDetail, AdminServices, tests)
[ ] Projects → ProjectsStore (Projects pages + AdminProjects, tests)
[ ] Testimonials → TestimonialsStore (Testimonials component + AdminTestimonials, tests)
[ ] Inquiries → InquiriesStore (Quote/Contact + AdminInquiries, tests)
[ ] Subscribers → SubscribersStore (FooterNewsletter + AdminSubscribers, tests)
[ ] Users/RBAC → UsersStore + front-only auth (AdminUsers, auth tests)
[ ] Campaigns & Donations → CampaignsStore + DonationsStore
    (Donate pages, AdminCampaigns, AdminDonations, Dashboard widgets + tests)

Once all boxes are checked:
[ ] Remove or archive src/lib/api.js and src/lib/apiClient.js
```

---

If you want next, we can take **Services vertical** and actually:

* rewrite `Services.jsx` + `ServiceDetail.jsx` to use `ServicesStore`,
* and give a matching update for `Services.test.jsx` + `ServicesAdmin.test.jsx` mocks.
