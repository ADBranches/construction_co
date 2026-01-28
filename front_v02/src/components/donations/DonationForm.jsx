// src/components/donations/DonationForm.jsx
import React from "react";

const PAYMENT_METHOD_LABELS = {
  card: "Card (Visa / Mastercard)",
  mtn_momo: "MTN MoMo",
  airtel_momo: "Airtel Money",
};

export default function DonationForm({
  form,
  errors,
  campaigns,
  loadingCampaigns,
  onChange,
  onSubmit,
}) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {/* Amount & currency */}
      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div>
        // AFTER
        <label
            htmlFor="amount"
            className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1"
        >
           Amount
        </label>
        <input
            id="amount"
            type="number"
            min="0"
            step="1000"
            name="amount"
            value={form.amount}
            onChange={onChange}
            className="w-full rounded-xl border border-[var(--brand-green)]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/60"
            placeholder="e.g. 50,000"
        />

          {errors.amount && (
            <p className="mt-1 text-[10px] text-red-600">{errors.amount}</p>
          )}
        </div>

        <div>
          // AFTER
            <label
                htmlFor="currency"
                className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1"
            >
            Currency
            </label>
            <select
                id="currency"
                name="currency"
                value={form.currency}
                onChange={onChange}
                className="w-full rounded-xl border border-[var(--brand-green)]/30 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/60"
            >

            <option value="UGX">UGX (Ugandan Shillings)</option>
            <option value="USD">USD</option>
          </select>
          {errors.currency && (
            <p className="mt-1 text-[10px] text-red-600">{errors.currency}</p>
          )}
        </div>
      </div>

      {/* Payment method */}
      <div>
        <p className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1">
          Payment method
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {["card", "mtn_momo", "airtel_momo"].map((method) => {
            const isSelected = form.payment_method === method;
            return (
              <button
                key={method}
                type="button"
                onClick={() =>
                  onChange({
                    target: { name: "payment_method", value: method, type: "text" },
                  })
                }
                className={`flex items-center justify-center rounded-xl border px-3 py-2 text-[11px] font-medium transition ${
                  isSelected
                    ? "border-[var(--brand-green)] bg-[var(--brand-green)]/10 text-[var(--brand-green)]"
                    : "border-gray-200 bg-white text-[var(--brand-contrast)]/80 hover:border-[var(--brand-green)]/50"
                }`}
              >
                {PAYMENT_METHOD_LABELS[method]}
              </button>
            );
          })}
        </div>
        {errors.payment_method && (
          <p className="mt-1 text-[10px] text-red-600">
            {errors.payment_method}
          </p>
        )}
      </div>

      {/* Campaign selection */}
      <div>
        <label
           htmlFor="campaign_id"
           className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1"
        >
           Campaign (optional)
        </label>
        <select
           id="campaign_id"
           name="campaign_id"
           value={form.campaign_id || ""}
           onChange={onChange}
           className="w-full rounded-xl border border-[var(--brand-green)]/30 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/60"
        >

          <option value="">
            General support (let Brisk allocate where needed most)
          </option>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
        {loadingCampaigns && (
          <p className="mt-1 text-[10px] text-[var(--brand-contrast)]/60">
            Loading active campaigns...
          </p>
        )}
      </div>

      {/* Donor details */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          // AFTER
        <label
           htmlFor="donor_name"
           className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1"
        >
           Full name
        </label>
        <input
           id="donor_name"
           type="text"
           name="donor_name"
           value={form.donor_name}
           onChange={onChange}
           className="w-full rounded-xl border border-[var(--brand-green)]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/60"
           placeholder="e.g. Mugisha Daniel"
           disabled={form.is_anonymous}
        />

          {errors.donor_name && (
            <p className="mt-1 text-[10px] text-red-600">{errors.donor_name}</p>
          )}
        </div>

        <div>
          // AFTER
            <label
                htmlFor="donor_email"
                className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1"
            >
                Email address
            </label>
            <input
                id="donor_email"
                type="email"
                name="donor_email"
                value={form.donor_email}
                onChange={onChange}
                className="w-full rounded-xl border border-[var(--brand-green)]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/60"
                placeholder="you@example.com"
                disabled={form.is_anonymous}
            />

          {errors.donor_email && (
            <p className="mt-1 text-[10px] text-red-600">{errors.donor_email}</p>
          )}
        </div>
      </div>

      <div>
        // AFTER
        <label
            htmlFor="donor_phone"
            className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1"
        >
            Phone (optional)
        </label>
        <input
            id="donor_phone"
            type="tel"
            name="donor_phone"
            value={form.donor_phone}
            onChange={onChange}
            className="w-full rounded-xl border border-[var(--brand-green)]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/60"
            placeholder="+2567..."
        />

      </div>

      {/* Anonymous toggle */}
      <div className="flex items-start gap-2">
        <input
          id="is_anonymous"
          type="checkbox"
          name="is_anonymous"
          checked={form.is_anonymous}
          onChange={onChange}
          className="mt-[2px] h-4 w-4 rounded border-gray-300 text-[var(--brand-green)] focus:ring-[var(--brand-green)]/60"
        />
        <div>
          <label
            htmlFor="is_anonymous"
            className="text-xs font-semibold text-[var(--brand-contrast)]"
          >
            Give anonymously
          </label>
          <p className="text-[10px] text-[var(--brand-contrast)]/70">
            If checked, we will not show your name publicly. We still use your
            details only for receipts where applicable.
          </p>
        </div>
      </div>

      {/* Message */}
      <div>
        // AFTER
        <label
            htmlFor="message"
            className="block text-xs font-semibold text-[var(--brand-contrast)] mb-1"
        >
            Message (optional)
        </label>
        <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={onChange}
            rows={3}
            className="w-full rounded-xl border border-[var(--brand-green)]/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]/60"
            placeholder="Share a note with the Brisk team…"
        />

      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-yellow)] px-6 py-2 text-xs md:text-sm font-semibold text-white hover:bg-[#f05010] transition"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
