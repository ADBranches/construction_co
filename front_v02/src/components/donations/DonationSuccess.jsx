// src/components/donations/DonationSuccess.jsx
import React from "react";

export default function DonationSuccess({
  intentResult,
  campaign,
  onNewDonation,
}) {
  const donation = intentResult?.donation;

  // Fallback if we somehow have no donation payload
  if (!donation) {
    return (
      <div className="space-y-4 text-xs">
        <p className="font-semibold text-[var(--brand-green)]">
          Thank you for your support!
        </p>
        <p className="text-[var(--brand-contrast)]/70">
          Your donation has been recorded, but we couldn&apos;t load the full
          receipt details.
        </p>
        <button
          type="button"
          onClick={onNewDonation}
          className="mt-2 inline-flex items-center justify-center rounded-xl bg-[var(--brand-yellow)] px-4 py-2 text-[11px] font-semibold text-white hover:bg-[#f05010] transition"
        >
          Make another donation
        </button>
      </div>
    );
  }

  // 🔹 Core derived fields
  const receiptCode = donation.receipt_code || donation.id;
  const currency = donation.currency || "UGX";
  const amountNumber = Number(donation.amount || 0);
  const amountDisplay = amountNumber.toLocaleString(); // e.g. "150,000"
  const amountDisplayWithCurrency = `${amountDisplay} ${currency}`;
  const paidTo = donation.paid_to || "Brisk Farm Solutions";
  const createdAt =
    donation.createdAt || donation.created_at || new Date().toISOString();
  const createdDate = new Date(createdAt).toLocaleString();
  const campaignName = campaign?.name || "Brisk Farm Solutions";

  // 🔹 QR payload for authenticity verification
  const qrPayload = JSON.stringify({
    ref: receiptCode,
    amount: amountNumber,
    currency,
    campaign: campaign?.slug || null,
    createdAt,
  });

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    qrPayload
  )}`;

  const paymentUrl = intentResult?.payment_url || null;

  // 🔹 Download .txt receipt
  const handleDownloadReceipt = () => {
    const lines = [
      "Brisk Farm Solutions & Construction Company",
      "Donation Receipt",
      "----------------------------------------",
      `Receipt reference: ${receiptCode}`,
      `Date: ${createdDate}`,
      `Amount: ${amountDisplayWithCurrency}`,
      `Paid to: ${paidTo}`,
      `Campaign: ${campaign?.name || "General support"}`,
      "",
      "Thank you for supporting sustainable farm and construction systems across Uganda.",
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brisk-donation-${receiptCode}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGoToPayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <div className="space-y-6 text-center text-xs md:text-sm">
      {/* Header */}
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
          continue to the payment step to complete the transaction. A receipt
          preview and verification QR are shown below.
        </p>
      </div>      

      {/* ⬇️ RECEIPT CARD */}
      <div className="mt-4 max-w-xl mx-auto rounded-2xl border border-[var(--brand-green)]/15 bg-[#f6fef9] px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <div className="flex-1 space-y-2 text-xs text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-contrast)]/70">
            Donation receipt
          </p>
          <p className="text-sm font-semibold text-[var(--brand-green)]">
            {amountDisplayWithCurrency}
          </p>
          <p className="text-[var(--brand-contrast)]/80">
            Reference:{" "}
            <span className="font-mono text-[11px]">{receiptCode}</span>
          </p>
          <p className="text-[var(--brand-contrast)]/70">Date: {createdDate}</p>
          <p className="text-[var(--brand-contrast)]/70">
            Paid to: <span className="font-medium">{paidTo}</span>
          </p>
          <p className="text-[var(--brand-contrast)]/70">
            Campaign:{" "}
            <span className="font-medium">
              {campaign?.name || "General support (Brisk allocates)"}
            </span>
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-yellow)] px-4 py-2 text-[11px] font-semibold text-white hover:bg-[#f05010] transition"
            >
              Download / print receipt
            </button>
            <button
              type="button"
              onClick={onNewDonation}
              className="inline-flex items-center justify-center rounded-xl border border-[var(--brand-contrast)]/20 px-4 py-2 text-[11px] font-medium text-[var(--brand-contrast)] hover:bg-[#f6fef9] transition"
            >
              Make another donation
            </button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="rounded-2xl bg-white p-3 shadow-sm border border-[var(--brand-green)]/10">
            <img
              src={qrSrc}
              alt="Donation receipt QR code"
              className="w-32 h-32 object-contain"
            />
          </div>
          <p className="mt-2 text-[10px] text-center text-[var(--brand-contrast)]/60">
            Scan to verify receipt details.
          </p>
        </div>
      </div>

      {/* ⬇️ ACTIONS BELOW CARD */}
      <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
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
