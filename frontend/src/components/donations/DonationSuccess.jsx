// src/components/donations/DonationSuccess.jsx
import React from "react";

export default function DonationSuccess({ intentResult, campaign, onNewDonation }) {
  const donation = intentResult?.donation;
  const paymentUrl = intentResult?.payment_url || null;

  const amountDisplay = donation?.amount
    ? Number(donation.amount).toLocaleString()
    : "";
  const currency = donation?.currency || "UGX";
  const campaignName = campaign?.name || "Brisk Farm Solutions";

  const handleGoToPayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <div className="space-y-6 text-center text-xs md:text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-yellow)]">
          Thank you
        </p>
        <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-[var(--brand-green)]">
          Your donation has been created
        </h2>
        <p className="mt-2 max-w-md mx-auto text-[var(--brand-contrast)]/80">
          We’ve recorded your intention to support{" "}
          <span className="font-semibold">{campaignName}</span>. You can now
          continue to the payment step to complete the transaction.
        </p>
      </div>

      {donation && (
        <div className="max-w-md mx-auto rounded-2xl border border-[var(--brand-green)]/20 bg-[#f6fef9] px-4 py-4 text-left text-xs">
          <div className="flex justify-between">
            <span className="text-[var(--brand-contrast)]/70">Amount</span>
            <span className="font-semibold text-[var(--brand-green)]">
              {amountDisplay} {currency}
            </span>
          </div>
          {donation.donor_email && (
            <div className="flex justify-between mt-1">
              <span className="text-[var(--brand-contrast)]/70">Email</span>
              <span className="font-medium text-[var(--brand-contrast)]">
                {donation.donor_email}
              </span>
            </div>
          )}
          <div className="mt-2 text-[10px] text-[var(--brand-contrast)]/60">
            Reference: <span className="font-mono">{donation.id}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {paymentUrl && (
          <button
            type="button"
            onClick={handleGoToPayment}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-yellow)] px-6 py-2 text-xs md:text-sm font-semibold text-white hover:bg-[#f05010] transition"
          >
            Continue to payment
          </button>
        )}

        <a
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-[var(--brand-contrast)]/20 px-6 py-2 text-xs md:text-sm font-medium text-[var(--brand-contrast)] hover:bg-[#f6fef9] transition"
        >
          Back to home
        </a>
      </div>

      <button
        type="button"
        onClick={onNewDonation}
        className="mt-4 text-[10px] text-[var(--brand-contrast)]/60 underline hover:text-[var(--brand-contrast)]/90"
      >
        Make another donation
      </button>
    </div>
  );
}
