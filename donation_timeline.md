Alright, let’s architect this properly before touching any code.
Here’s a **phase-by-phase timeline** with **exact files/directories** to touch on backend & frontend (+ tests + docs) for a clean, professional donation module.

---

## Phase 0 – Spec & Docs (no code)

**Docs (repo root or `/docs/`):**

* `docs/donations/Donation_Module_Spec.md`

  * Goals & scope
  * User flows: public donor, admin, accountant
  * States: `pending`, `confirmed`, `failed`, `refunded`
* `docs/donations/Donation_API_Spec.md`

  * All endpoints, request/response shapes
* `docs/donations/Payment_Flow_Sequence.md`

  * Diagram: Frontend → Backend → Payment Provider → Webhook → Backend → Email

*(This is mainly writing, but it drives everything below.)*

---

## Phase 1 – Backend Data Model (DB & Pydantic)

### Backend – Models & Schemas

**New model files:**

* `app/models/donation.py`

  * `Donation` model (id, amount, currency, status, donor info, campaign_id, payment_provider_id, etc.)
* `app/models/campaign.py`

  * `Campaign` model (id, name, slug, target_amount, raised_amount, status, etc.)

**Existing model updates:**

* `app/models/__init__.py`

  * Import `Donation` & `Campaign` models so Alembic / app sees them.

**New schema files:**

* `app/schemas/donation.py`

  * `DonationCreate`, `DonationPublic`, `DonationAdmin`, etc.
* `app/schemas/campaign.py`

  * `CampaignCreate`, `CampaignUpdate`, `CampaignPublic`, `CampaignAdmin`.

**Existing schema updates:**

* `app/schemas/__init__.py`

  * Export new schemas if you use central exports.

**DB migration:**

* `migrations/versions/<timestamp>_add_donations_and_campaigns.py`

  * Create `donations` and `campaigns` tables
  * Add FKs to `services` / `projects` if needed.

### Tests (Phase 1)

* `tests/test_models_donation.py`

  * Creating Donation with valid data
  * Enum/status defaults
* `tests/test_models_campaign.py`

  * Campaign creation, slug uniqueness, active/closed states.

---

## Phase 2 – Backend Core Donation & Campaign APIs (no payment yet)

### Backend – API routers & services

**New routers:**

* `app/api/v1/campaigns.py`

  * `GET /api/v1/campaigns` (public)
  * `GET /api/v1/campaigns/{slug}` (public)
  * Admin-only:

    * `POST /api/v1/campaigns`
    * `PUT /api/v1/campaigns/{campaign_id}`
    * `DELETE /api/v1/campaigns/{campaign_id}` (soft delete recommended)

* `app/api/v1/donations.py`

  * `POST /api/v1/donations` – create donation intent (no payment provider yet, just record)
  * Admin-only:

    * `GET /api/v1/donations`
    * `GET /api/v1/donations/{donation_id}`

**Router registration:**

* `app/api/v1/__init__.py` or `app/main.py`

  * Include `campaigns` and `donations` routers.

**Business logic service:**

* `app/services/donation_service.py`

  * Functions like `create_donation`, `list_donations`, `mark_confirmed`, etc.

### Tests (Phase 2)

* `tests/api/test_campaigns_api.py`

  * List campaigns (public)
  * Admin create/update
  * Permissions checks.
* `tests/api/test_donations_api.py`

  * `POST /donations` creates a pending donation
  * Validates required fields, campaign reference, etc.

---

## Phase 3 – Payment Provider Integration (card/MoMo)

### Backend – Payment integration

**Config & env:**

* `app/config.py`

  * Add settings for payment provider keys, webhook secrets, base URLs.
* `.env.example`

  * `PAYMENT_PROVIDER_PUBLIC_KEY=`
  * `PAYMENT_PROVIDER_SECRET_KEY=`
  * `PAYMENT_WEBHOOK_SECRET=`

**Payment service wrapper:**

* `app/services/payment_provider_service.py`

  * Create payment session/intent
  * Verify webhook signatures
  * Map provider statuses → your enums

**Donation endpoints extension:**

* `app/api/v1/donations.py`

  * Extend `POST /donations` to:

    * Call payment provider
    * Return payment URL / client secret to frontend
  * New route:

    * `POST /donations/webhook` (no auth; uses signature to trust provider)

**Donation model updates:**

* `app/models/donation.py`

  * Fields for `provider_session_id`, `provider_customer_id`, etc.

### Tests (Phase 3)

* `tests/services/test_payment_provider_service.py`

  * Use mocked HTTP client / fake payloads
* `tests/api/test_donations_webhook.py`

  * Valid webhook → updates donation to `confirmed`
  * Invalid signature → 400 and no state change.

---

## Phase 4 – Frontend Public Donate Flow

### Frontend – Core donation UX

**New page:**

* `src/pages/Donate.jsx`

  * Central donation form wizard (amount, frequency, campaign, donor info)
  * Uses new donation API endpoints.

**New components:**

* `src/components/donations/DonateButton.jsx`

  * Small CTA button (e.g. used in Hero, footer, project cards) linking to `/donate` or pre-selecting a campaign.
* `src/components/donations/DonationForm.jsx`

  * Form fields, validation, state handling.
* `src/components/donations/DonationSummary.jsx`

  * Shows amount, frequency, campaign, donor info before confirming.
* `src/components/donations/DonationSuccess.jsx`

  * Thank-you view with summary, share buttons, link back to site.
* `src/components/donations/DonationFailure.jsx`

  * Error state and retry CTA.

**Existing layout updates:**

* `src/components/layout/Navbar.jsx`

  * Add “Donate” link or secondary CTA button that routes to `/donate`.
* `src/pages/Home.jsx`

  * Optional: add `DonateButton` in hero or CTA section.
* `src/pages/ProjectDetail.jsx`

  * Optional: “Support this type of project” → passes campaign ID to Donate.

**API helpers:**

* `src/lib/api.js`

  * `DonationAPI.createIntent(data)`
  * `CampaignAPI.list()` / `CampaignAPI.get(slug)`

### Tests (Phase 4)

* `src/__tests__/Donate.test.jsx`

  * Renders form
  * Validates amount & required fields
  * Calls API on submit (mock fetch)
* `src/__tests__/DonateButton.test.jsx`

  * Navigates to `/donate` with correct state/params.

---

## Phase 5 – Admin Donation & Campaign Management

### Frontend – Admin UI

**New admin pages:**

* `src/pages/admin/AdminCampaigns.jsx`

  * List campaigns, create/update, toggle active/closed.
* `src/pages/admin/AdminDonations.jsx`

  * Filterable table:

    * Date range, campaign, status, amount range
    * View details (drawer/modal)

**Admin layout integration:**

* `src/components/admin/Sidebar.jsx`

  * Add links:

    * “Campaigns”
    * “Donations”
* `src/components/admin/Table.jsx` (re-use)

  * Configure columns for donations & campaigns.

### Backend – Admin extras

**API improvements:**

* `app/api/v1/campaigns.py`

  * Support pagination, filtering by status.
* `app/api/v1/donations.py`

  * Filtering by:

    * `campaign_id`
    * `status`
    * `date_from` / `date_to`

### Tests (Phase 5)

* `src/__tests__/AdminCampaigns.test.jsx`

  * Renders list from mocked API
  * Creates/updates campaigns.

* `src/__tests__/AdminDonations.test.jsx`

  * Filters correctly and displays results.

* `tests/api/test_donations_filters.py`

  * Ensures backend filters work (date range, campaign, status).

---

## Phase 6 – Recurring Donations (Subscriptions) – *Advanced, optional*

### Backend

**Model:**

* `app/models/recurring_donation.py`

  * Frequency, amount, status, next_billing_at, provider_subscription_id.
* `app/schemas/recurring_donation.py`
* Migration:

  * `migrations/versions/<timestamp>_add_recurring_donations.py`

**API:**

* `app/api/v1/recurring_donations.py`

  * `POST /recurring-donations` – create subscription
  * `GET /recurring-donations` – admin list
* Extend `payment_provider_service.py`

  * Create subscriptions
  * Handle subscription webhooks (renewals, failures, cancellations).

### Frontend

* Extend `src/pages/Donate.jsx`

  * Add “Make this monthly” toggle.
* New admin page:

  * `src/pages/admin/AdminRecurringDonations.jsx` (optional)

### Tests (Phase 6)

* `tests/api/test_recurring_donations_api.py`
* `src/__tests__/RecurringDonateFlow.test.jsx`

---

## Phase 7 – Emails, Receipts & Reporting Polish

### Backend

**Email integration:**

* `app/utils/email_sender.py`

  * New function: `send_donation_receipt(donation)`
* `app/services/donation_service.py`

  * Hook after confirmation to send receipt.

**Reporting endpoints (optional):**

* `app/api/v1/stats.py` (reuse existing stats router if you already have it)

  * Add donation stats: totals per campaign/time period.

### Frontend

* `src/pages/admin/AdminDashboard.jsx`

  * Add donation summary cards:

    * Total donated this month
    * # of donors
    * Top campaign

### Tests (Phase 7)

* `tests/services/test_donation_emails.py`

  * Confirm email is constructed & sent (mock email backend).
* `src/__tests__/DashboardDonationsWidget.test.jsx`

  * Dashboard shows correct numbers with mocked stats API.

---

## Phase 8 – Documentation, Env & Launch Checklist

**Docs:**

* Update `README.md` (backend + frontend):

  * “Donations module” section
  * How to set payment provider keys
  * How to run migrations and seed campaigns (if you add seeds)
* `docs/donations/Admin_Usage_Guide.md`

  * Step-by-step: create campaign, check donations, export data.

**Env & deployment:**

* Ensure Render/production env has:

  * Payment keys
  * Webhook URL configured in provider dashboard
* Run migrations & initial inserts (campaign seeds) on prod.

---

If you like this structure, next we can pick **Phase 1** and design the exact `Donation` + `Campaign` fields (names + types) to match your existing `project` / `service` style and keep the tests & migrations clean.

