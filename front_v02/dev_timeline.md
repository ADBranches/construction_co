
---

## Phase 0 – Freeze backend & lock front_v02 as source of truth

**Goal:** Treat this as a standalone app.

**What you do:**

* Stop running/depending on backend for this version.
* In `front_v02/README.md`:

  * Clearly state: **“Frontend-only Brisk CMS + Donate module. No live API; all data is local.”**
* Keep `.env` empty or remove `VITE_API_BASE_URL` from use later.

---

## Phase 1 – Decide “domains” & what must stay rich

**Goal:** Decide which features remain **fully functional**, not demo.

Domains (all stay real):

* **Services**: CRUD + featured services
* **Projects**: CRUD + project detail
* **Testimonials**: CRUD + public display
* **Subscribers**: capture email + list in admin
* **Inquiries / Quote**: capture inquiries, admin view & status
* **Users (admin side)**: RBAC-ish (roles, at least in UI)
* **Campaigns**: donation campaigns CRUD
* **Donations**: create via Donate flow, view + filter in Admin
* **Dashboard widgets**: show real stats computed from donations/projects/etc.

You’ve basically said: **all of these must be rich**, so nothing gets simplified away.
This phase is just a checklist + maybe a small doc.

---

## Phase 2 – Shape of `data/` modules (default exports)

You already have:

```text
src/data
  donationsData.js
  inquiriesData.js
  projectsData.js
  servicesData.js
  subscribersData.js
  testimonialsData.js
  usersData.js
```

**Goal:** Define what each file will eventually hold (still no content now), and enforce **default export only**.

Plan for each file (later):

* `servicesData.js` → **default export**: array of service objects.
* `projectsData.js` → default export: array of project objects.
* `testimonialsData.js` → default export: array of testimonials.
* `subscribersData.js` → default export: initial array (maybe empty).
* `inquiriesData.js` → default export: initial array (maybe empty).
* `usersData.js` → default export: initial user list (admin + staff).
* `donationsData.js` → default export: **starts empty** but typed shape.

So later pattern is:

```js
// src/data/servicesData.js
const servicesSeed = [/* ... */];
export default servicesSeed;
```

But **right now**: just agree this is the shape.

---

## Phase 3 – Design `localStore` API (default export)

File already exists:

```text
src/lib/localStore.js
```

**Goal now:** Decide its **public contract**, no implementation.

Planned default export (later):

* `load(key, fallback)`
* `save(key, value)`
* `initWithSeed(key, seedArrayOrObject)`
* Maybe `clear(key)` if needed for tests.

Pattern (later):

```js
// localStore.js
const localStore = {
  load,
  save,
  initWithSeed,
};

export default localStore;
```

For now: leave file mostly comments describing these functions.

---

## Phase 4 – Design per-domain Stores (rich behavior)

We’ll introduce one **store module per domain**, all **default exports**, all using `localStore` inside.

New files (they don’t exist yet, just plan):

* `src/lib/servicesStore.js`
* `src/lib/projectsStore.js`
* `src/lib/testimonialsStore.js`
* `src/lib/subscribersStore.js`
* `src/lib/inquiriesStore.js`
* `src/lib/usersStore.js`
* `src/lib/campaignsStore.js`
* `src/lib/donationsStore.js`

Each store will eventually:

* On first access:

  * Call `localStore.initWithSeed(...)` using the matching `data/*Data.js` default export.
* Expose **CRUD + queries** via **default export object**, e.g. later:

  ```js
  const ServicesStore = {
    list,
    getBySlug,
    create,
    update,
    remove,
  };

  export default ServicesStore;
  ```

For now: create these files with **only comments** describing methods you want:

* `list`, `create`, `update`, `remove`
* plus any special queries like:

  * `getFeatured`, `getDashboardStats`, `listByStatus`, `filterDonations(filters)` etc.

---

## Phase 5 – Plan the migration from API to Stores (feature by feature)

You still have **real API layers**:

* `src/lib/apiClient.js` – fetch wrapper
* `src/lib/api.js` – domain-ish wrappers (`ServiceAPI`, `ProjectAPI`, etc.)

**Goal:** Define *how* and *when* to swap each feature to local store, **without breaking tests all at once**.

### 5.1. Decide on deprecation strategy

We won’t kill them immediately. Plan:

* Step 1: **Public pages** (no auth) will **directly use data/ + stores** → stop using `api.js` for them.
* Step 2: **Admin pages** will switch from `ServiceAPI`/`ProjectAPI` to `ServicesStore`/`ProjectsStore` etc.
* Step 3: Once every page *and* test is store-based → we can mark `api.js` / `apiClient.js` as unused and later delete or keep as tiny wrappers around Stores (but not used in UI).

### 5.2. Migration order (front-of-site → admin CMS)

Order to refactor later:

1. **Services (public + admin)**

   * `Services.jsx`, `ServiceDetail.jsx`, `AdminServices.jsx`, `Services.test.jsx`, `ServicesAdmin.test.jsx`.
2. **Projects**

   * `Projects.jsx`, `ProjectDetail.jsx`, `AdminProjects.jsx`, `ProjectsAdmin.test.jsx`.
3. **Testimonials**

   * `Testimonials.jsx`, `AdminTestimonials.jsx`, `TestimonialsAdmin.test.jsx`.
4. **Quote / Inquiries**

   * `Quote.jsx`, `AdminInquiries.jsx`, `InquiriesAdmin.test.jsx`.
5. **Subscribers**

   * `FooterNewsletter.jsx`, `AdminSubscribers.jsx`, `SubscribersAdmin.test.jsx`.
6. **Users**

   * `AdminUsers.jsx`, `UsersAdmin.test.jsx`.
7. **Campaigns & Donations (rich bit)**

   * `Donate.jsx` + `components/donations/*`
   * `AdminCampaigns.jsx`, `AdminDonations.jsx`
   * `DashboardDonationsWidget.jsx`
   * tests: `Donate.test.jsx`, `DonateButton.test.jsx`, `AdminCampaigns.test.jsx`, `AdminDonations.test.jsx`, `DashboardDonationsWidget.test.jsx`.

This ordering is important because it keeps public site working first, then admin CMS, then advanced donations.

---

## Phase 6 – Frontend-only Auth & Admin Guard design

Files in play:

* `src/lib/auth.js`
* `src/components/layout/useRequireAdmin.js`
* `src/pages/admin/AdminLogin.jsx`
* Tests: `auth.test.jsx`, plus any that rely on admin access.

**Plan (still conceptual):**

* `auth.js` (default export object):

  * `login(email, password)` – checks against a static admin list from `usersData.js` or `UsersStore`.
  * `logout()`
  * `isAdmin()` – checks `localStorage` flag.
* `useRequireAdmin.js`:

  * Read from `auth.isAdmin()` instead of a backend token check.
  * If false → redirect to `/admin/login`.
* `AdminLogin.jsx`:

  * Calls `auth.login()` and sets admin flag if credentials match; otherwise, error state.

All frontend-only but **feels real**: you must log in to see admin.

---

## Phase 7 – Rich donation & dashboard behavior (still frontend-only)

We explicitly keep these **non-mock**:

* `src/pages/Donate.jsx`
* `src/components/donations/DonateButton.jsx`
* `src/components/donations/DonationForm.jsx`
* `src/components/donations/DonationSummary.jsx`
* `src/components/donations/DonationSuccess.jsx`
* `src/components/donations/DonationFailure.jsx`
* `src/pages/admin/AdminCampaigns.jsx`
* `src/pages/admin/AdminDonations.jsx`
* `src/components/admin/DashboardDonationsWidget.jsx`

Planned store behavior (later):

* `campaignsStore`:

  * CRUD for campaigns.
  * Mark active/closed.
* `donationsStore`:

  * `createDonationFromForm(payload)` (called from Donate flow).
  * Store donation objects with timestamps.
  * Filtering: by campaign, status, date, amount.
* `DashboardDonationsWidget`:

  * Compute stats from `donationsStore` + `campaignsStore`:

    * total donations this month
    * total per campaign
    * etc.

All of this is fully functional using localStorage; only the *payment gateway* part is simulated (no real Momo/Stripe).

---

## Phase 8 – Cleanup & deployment-grade polish (concept)

Only **after** all features point to Stores:

* **Code cleanup:**

  * Remove unused imports of `api.js`, `apiClient.js`, `fetcher.js`.
  * If still used *only in one or two places*, convert them to **thin wrappers** around the Stores or delete them and use Stores directly.
* **Error handling UX:**

  * Even though no network, keep error states:

    * Validation errors on forms.
    * “No data yet” empty states.
* **Deployment:**

  * `npm run build` → static output.
  * Deploy via any static host (Vercel, Netlify, Render static site, Cloudflare Pages, etc.).
  * Since everything is local, there’s **no runtime dependency** apart from browser + localStorage.

---

