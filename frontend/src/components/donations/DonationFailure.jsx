// src/components/donations/DonationFailure.jsx
import React from "react";

export default function DonationFailure({ message, onRetry }) {
  return (
    <div className="space-y-4 text-center text-xs md:text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-500">
          Something went wrong
        </p>
        <h2 className="mt-2 text-xl md:text-2xl font-extrabold text-[var(--brand-contrast)]">
          We couldn’t create your donation
        </h2>
        <p className="mt-2 max-w-md mx-auto text-[var(--brand-contrast)]/80">
          {message ||
            "Please check your details and internet connection, then try again."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-yellow)] px-6 py-2 text-xs md:text-sm font-semibold text-white hover:bg-[#f05010] transition"
        >
          Back to form
        </button>

        <a
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-[var(--brand-contrast)]/20 px-6 py-2 text-xs md:text-sm font-medium text-[var(--brand-contrast)] hover:bg-[#f6fef9] transition"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
