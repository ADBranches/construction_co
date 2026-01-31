// src/pages/Donate.jsx
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Seo from "../seo/Seo";
import CampaignsStore from "../lib/campaignsStore";
import DonationsStore from "../lib/donationsStore";
import DonationForm from "../components/donations/DonationForm";
import DonationSummary from "../components/donations/DonationSummary";
import DonationSuccess from "../components/donations/DonationSuccess";
import DonationFailure from "../components/donations/DonationFailure";

const ALLOWED_PAYMENT_METHODS = ["card", "mtn_momo", "airtel_momo"];

const PAYMENT_DESTINATION = {
  card: "Visa card ending •••• 1612",
  mtn_momo: "MTN MoMo — +256 783 111 015",
  airtel_momo: "Airtel Money — +256 783 111 015",
};

const defaultForm = {
  amount: "",
  currency: "UGX",
  payment_method: "card",
  campaign_id: "",
  donor_name: "",
  donor_email: "",
  donor_phone: "",
  is_anonymous: false,
  message: "",
};

export default function Donate() {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const [campaigns, setCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [campaignsError, setCampaignsError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [intentResult, setIntentResult] = useState(null);

  const [searchParams] = useSearchParams();

  // Prefill campaign from query (?campaign=slug)
  useEffect(() => {
    const slugFromQuery = searchParams.get("campaign");
    if (!slugFromQuery) return;

    setForm((prev) => ({
      ...prev,
      // we'll map slug -> id once campaigns load; for now keep it in message hint
      campaign_slug_hint: slugFromQuery,
    }));
  }, [searchParams]);

  // Load campaigns from front-only store
  useEffect(() => {
    setLoadingCampaigns(true);
    setCampaignsError("");

    try {
      const items = CampaignsStore.getActive();
      setCampaigns(items);
      setLoadingCampaigns(false);

      // If we had a slug hint from query, map it to a real id once
      setForm((prev) => {
        if (!prev.campaign_slug_hint || prev.campaign_id) return prev;
        const match = items.find((c) => c.slug === prev.campaign_slug_hint);
        if (!match) return prev;
        return {
          ...prev,
          campaign_id: match.id,
        };
      });
    } catch (err) {
      setCampaignsError(err?.message || "Failed to load campaigns.");
      setLoadingCampaigns(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCampaign = useMemo(
    () => campaigns.find((c) => c.id === form.campaign_id),
    [campaigns, form.campaign_id]
  );

  // 🔹 Flutterwave config built from form
  const flutterwaveConfig = useMemo(
    () => ({
      public_key: import.meta.env.VITE_FLW_PUBLIC_KEY,
      tx_ref: `BRISK-${Date.now()}`,
      amount: Number(form.amount || 0),
      currency: form.currency || "UGX",
      payment_options: "card,mobilemoneyuganda",
      customer: {
        email:
          form.is_anonymous || !form.donor_email
            ? "donor@briskfarmsolutions.com"
            : form.donor_email,
        phone_number: form.donor_phone || "0000000000",
        name:
          form.is_anonymous || !form.donor_name
            ? "Anonymous Brisk Donor"
            : form.donor_name,
      },
      customizations: {
        title: "Brisk Donation",
        description: selectedCampaign
          ? `Donation to ${selectedCampaign.name}`
          : "General support for Brisk Farm Solutions",
        logo: "/brisk_logo5.png",
      },
    }),
    [form, selectedCampaign]
  );

  const handleFlutterPayment = useFlutterwave(flutterwaveConfig);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};

    const amountNumber = Number(form.amount);
    if (!form.amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      newErrors.amount = "Enter a valid amount greater than zero.";
    }

    if (!form.currency) {
      newErrors.currency = "Select a currency.";
    }

    if (!ALLOWED_PAYMENT_METHODS.includes(form.payment_method)) {
      newErrors.payment_method = "Select a valid payment method.";
    }

    if (!form.is_anonymous) {
      if (!form.donor_name?.trim()) {
        newErrors.donor_name =
          "Please enter your name or choose to give anonymously.";
      }
      if (!form.donor_email?.trim()) {
        newErrors.donor_email =
          "Please enter your email or choose to give anonymously.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateStep1()) return;

    setStep(2);
  };

  const handleBackToForm = () => {
    setStep(1);
    setApiError("");
  };

  // 🔹 Real payment handler using Flutterwave inline
  const handleConfirm = async () => {
    setSubmitting(true);
    setApiError("");

    // Just in case: basic guard
    const amountNumber = Number(form.amount || 0);
    if (!amountNumber || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setApiError("Enter a valid amount before confirming.");
      setSubmitting(false);
      return;
    }

    // Open Flutterwave checkout
    handleFlutterPayment({
      callback: (response) => {
        try {
          const isSuccess =
            response?.status === "successful" ||
            response?.status === "success";

          if (!isSuccess) {
            setApiError(
              "Payment was not completed. You can try again or use another method."
            );
            setStep("error");
            return;
          }

          // 🔹 Generate receipt + destination info
          const receiptCode = `BRISK-${Date.now()
            .toString(36)
            .toUpperCase()}`;

          const paidTo =
            PAYMENT_DESTINATION[form.payment_method] ||
            "Brisk Farm Solutions";

          const payload = {
            amount: amountNumber,
            currency: form.currency,
            payment_method: form.payment_method,
            donor_name: form.is_anonymous ? null : form.donor_name || null,
            donor_email: form.is_anonymous ? null : form.donor_email || null,
            donor_phone: form.donor_phone || null,
            is_anonymous: form.is_anonymous,
            message: form.message || null,
            campaign_id: form.campaign_id || null,
            status: "confirmed",

            // Receipt metadata
            receipt_code: receiptCode,
            paid_to: paidTo,

            // Provider metadata (best effort)
            provider: "flutterwave",
            provider_tx_ref: response?.tx_ref || null,
            provider_transaction_id: response?.transaction_id || null,
          };

          const donation = DonationsStore.create(payload);

          const fakeIntent = {
            donation,
            payment_url: null,
            provider_session_id: response?.transaction_id || null,
          };

          setIntentResult(fakeIntent);
          setStep("success");
        } catch (err) {
          console.error("Error handling donation success:", err);
          setApiError(
            "We received a payment response but failed to record the donation properly. Please contact Brisk with your transaction reference."
          );
          setStep("error");
        } finally {
          setSubmitting(false);
          closePaymentModal();
        }
      },
      onClose: () => {
        // User closed the modal without paying
        setSubmitting(false);
      },
    });
  };

  const handleNewDonation = () => {
    setForm(defaultForm);
    setErrors({});
    setApiError("");
    setIntentResult(null);
    setStep(1);
  };

  return (
    <>
      <Seo
        title="Donate | Brisk Farm Solutions & Construction Company"
        description="Support Brisk Farm Solutions as we build sustainable biogas, waste management and farm systems across Uganda."
      />

      <div className="bg-gradient-to-b from-[#f6fef9] via-[#f6fef9] to-white min-h-screen">
        <section className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* Page intro */}
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Donate
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-[var(--brand-green)]">
            Support Brisk Farm Solutions
          </h1>
          <p className="mt-2 max-w-2xl text-xs md:text-sm text-[var(--brand-contrast)]/85">
            Your contribution helps us implement biodigester systems, waste
            management solutions, farm training and construction projects that
            keep households, farms and institutions resilient across Uganda.
          </p>

          {/* Main layout: form + sidebar */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,1.3fr)]">
            {/* Left: dynamic form / summary / receipt */}
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--brand-green)]/15 p-5 md:p-8 space-y-6">
              {/* Step indicator */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[var(--brand-green)]/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-green)]">
                    {step === 1
                      ? "Step 1 of 3"
                      : step === 2
                      ? "Step 2 of 3"
                      : step === "success"
                      ? "Receipt"
                      : "Donation error"}
                  </span>
                  <span className="hidden sm:inline text-[10px] text-[var(--brand-contrast)]/75">
                    {step === 1 && "Enter your donation amount and details."}
                    {step === 2 &&
                      "Review and confirm your donation before submitting."}
                    {step === "success" &&
                      "Your donation has been recorded. View your receipt below."}
                    {step === "error" &&
                      "Something went wrong. You can try again in a moment."}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--brand-contrast)]/70">
                  <span className="inline-block h-2 w-2 rounded-full bg-[var(--brand-green)]/80" />
                  <span>Secure, mobile-money &amp; card friendly</span>
                </div>
              </div>

              {/* Campaigns notice */}
              {campaignsError && (
                <p className="text-xs text-red-600 mb-1">{campaignsError}</p>
              )}

              {/* Step content */}
              {step === 1 && (
                <DonationForm
                  form={form}
                  errors={errors}
                  campaigns={campaigns}
                  loadingCampaigns={loadingCampaigns}
                  onChange={handleChange}
                  onSubmit={handleNext}
                />
              )}

              {step === 2 && (
                <DonationSummary
                  form={form}
                  campaign={selectedCampaign}
                  onBack={handleBackToForm}
                  onConfirm={handleConfirm}
                  submitting={submitting}
                />
              )}

              {step === "success" && (
                <DonationSuccess
                  intentResult={intentResult}
                  campaign={selectedCampaign}
                  onNewDonation={handleNewDonation}
                />
              )}

              {step === "error" && (
                <DonationFailure message={apiError} onRetry={handleBackToForm} />
              )}
            </div>

            {/* Right: impact + payment info */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-[var(--brand-green)]/15 bg-[#003023] text-white p-5 md:p-6">
                <h2 className="text-sm md:text-base font-semibold">
                  How your donation helps
                </h2>
                <p className="mt-2 text-[11px] md:text-xs text-white/85">
                  Every contribution moves a real project forward: biodigesters,
                  farm waste management, capacity building and resilient
                  construction for households and institutions across Uganda.
                </p>
                <ul className="mt-3 space-y-1.5 text-[11px] md:text-xs text-white/85">
                  <li>• Expand access to clean biogas energy.</li>
                  <li>• Turn farm and household waste into useful resources.</li>
                  <li>• Train farmers and institutions to manage modern systems.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--brand-green)]/15 bg-white p-5 md:p-6 text-xs text-[var(--brand-contrast)]">
                <h3 className="text-sm font-semibold text-[var(--brand-green)]">
                  Payment details
                </h3>
                <p className="mt-2 text-[11px] text-[var(--brand-contrast)]/80">
                  After you confirm the form and complete payment in the secure
                  window, Brisk records your donation and generates a receipt
                  with a verification QR code.
                </p>

                <div className="mt-3 space-y-2 text-[11px]">
                  <p className="font-semibold text-[var(--brand-contrast)]">
                    Card (Visa / Mastercard)
                  </p>
                  <p className="font-mono text-[var(--brand-contrast)]/85">
                    5225 1100 0367 1612
                  </p>

                  <p className="mt-3 font-semibold text-[var(--brand-contrast)]">
                    MTN MoMo
                  </p>
                  <p className="text-[var(--brand-contrast)]/85">
                    +256 783 111 015
                  </p>

                  <p className="mt-3 font-semibold text-[var(--brand-contrast)]">
                    Airtel Money
                  </p>
                  <p className="text-[var(--brand-contrast)]/85">
                    +256 783 111 015
                  </p>
                </div>

                <div className="mt-4 border-t border-[var(--brand-contrast)]/10 pt-3 text-[10px] text-[var(--brand-contrast)]/70">
                  Questions about a transfer or receipt? Reach us at{" "}
                  <span className="font-medium">
                    briskfarmsolutions@gmail.com
                  </span>{" "}
                  or{" "}
                  <span className="font-medium">+256 783 111 015</span>.
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}
