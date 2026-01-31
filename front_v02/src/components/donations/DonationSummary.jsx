// src/components/donations/DonationSummary.jsx
import React from "react";

const PAYMENT_LABELS = {
  card: "Card (Visa / Mastercard)",
  mtn_momo: "MTN MoMo",
  airtel_momo: "Airtel Money",
};

export default function DonationSummary({
  form,
  campaign,
  onBack,
  onConfirm,
  submitting,
}) {
  const amountDisplay = form.amount ? Number(form.amount).toLocaleString() : "";
  const paymentLabel = PAYMENT_LABELS[form.payment_method] || "Card";

  const PAYMENT_INSTRUCTIONS = {
    card:
      "You’ll pay using your Visa / Mastercard. Brisk’s receiving card ends with 1612.",
    mtn_momo:
      "Send your MTN MoMo payment to +256 783 111 015. Use your name as the payment reference.",
    airtel_momo:
      "Send your Airtel Money payment to +256 783 111 015. Use your name as the payment reference.",
  };

  const paymentInstruction =
    PAYMENT_INSTRUCTIONS[form.payment_method] ||
    "You’ll complete the payment with Brisk’s team.";

  const campaignName = campaign?.name || "General support (Brisk allocates)";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-[var(--brand-contrast)] mb-1">
          Review your donation
        </p>
        <p className="text-[11px] text-[var(--brand-contrast)]/70">
          Please confirm the details below before continuing to the secure
          payment step.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--brand-green)]/20 bg-[#f6fef9] px-4 py-4 space-y-3 text-xs">
        <div className="flex justify-between">
          <span className="text-[var(--brand-contrast)]/80">Amount</span>
          <span className="font-semibold text-[var(--brand-green)]">
            {amountDisplay} {form.currency}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-[var(--brand-contrast)]/80">
            Payment method
          </span>

          <span className="font-medium text-[var(--brand-contrast)]">
            {paymentLabel}
          </span>
        </div>

        {/* ⬇️ New instructions line */}
        {paymentInstruction && (
          <p className="mt-1 text-[10px] text-[var(--brand-contrast)]/60">
            {paymentInstruction}
          </p>
        )}

        <div className="flex justify-between gap-4">
          <span className="text-[var(--brand-contrast)]/80">Campaign</span>
          <span className="font-medium text-[var(--brand-contrast)] text-right">
            {campaignName}
          </span>
        </div>

        {!form.is_anonymous && (
          <>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--brand-contrast)]/80">Donor</span>
              <span className="font-medium text-[var(--brand-contrast)] text-right">
                {form.donor_name || "—"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[var(--brand-contrast)]/80">Email</span>
              <span className="font-medium text-[var(--brand-contrast)] text-right">
                {form.donor_email || "—"}
              </span>
            </div>
          </>
        )}

        {form.donor_phone && (
          <div className="flex justify-between gap-4">
            <span className="text-[var(--brand-contrast)]/80">Phone</span>
            <span className="font-medium text-[var(--brand-contrast)] text-right">
              {form.donor_phone}
            </span>
          </div>
        )}

        {form.message && (
          <div className="pt-2 border-t border-[var(--brand-green)]/10">
            <p className="text-[var(--brand-contrast)]/70 mb-1">Message</p>
            <p className="text-[11px] text-[var(--brand-contrast)]">
              {form.message}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-xl border border-[var(--brand-contrast)]/20 px-5 py-2 text-[11px] font-medium text-[var(--brand-contrast)] hover:bg-[#f6fef9] transition"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-yellow)] px-6 py-2 text-[11px] md:text-sm font-semibold text-white hover:bg-[#f05010] transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? "Processing…" : "Confirm Donation"}
        </button>
      </div>
    </div>
  );
}
