// src/pages/Donate.jsx
import { useEffect, useState, useMemo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Seo from "../seo/Seo";
import api from "../lib/apiClient";
import DonationForm from "../components/donations/DonationForm";
import DonationSummary from "../components/donations/DonationSummary";
import DonationSuccess from "../components/donations/DonationSuccess";
import DonationFailure from "../components/donations/DonationFailure";

const ALLOWED_PAYMENT_METHODS = ["card", "mtn_momo", "airtel_momo"];

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

  const location = useLocation();
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

  // Load campaigns from backend
  useEffect(() => {
    let mounted = true;
    setLoadingCampaigns(true);
    setCampaignsError("");

    api
      .get("/api/v1/campaigns")
      .then((data) => {
        if (!mounted) return;
        const items = Array.isArray(data) ? data : data?.items || [];
        setCampaigns(items);
        setLoadingCampaigns(false);

        // If we had a slug hint from query, map it to a real id once
        if (form.campaign_id || !form.campaign_slug_hint) return;
        const match = items.find((c) => c.slug === form.campaign_slug_hint);
        if (match) {
          setForm((prev) => ({
            ...prev,
            campaign_id: match.id,
          }));
        }
      })
      .catch((err) => {
        if (!mounted) return;
        setCampaignsError(err.message || "Failed to load campaigns.");
        setLoadingCampaigns(false);
      });

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedCampaign = useMemo(
    () => campaigns.find((c) => c.id === form.campaign_id),
    [campaigns, form.campaign_id]
  );

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
        newErrors.donor_name = "Please enter your name or choose to give anonymously.";
      }
      if (!form.donor_email?.trim()) {
        newErrors.donor_email = "Please enter your email or choose to give anonymously.";
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

  const handleConfirm = async () => {
    setSubmitting(true);
    setApiError("");

    const payload = {
      amount: Number(form.amount),
      currency: form.currency,
      payment_method: form.payment_method,
      donor_name: form.is_anonymous ? null : form.donor_name || null,
      donor_email: form.is_anonymous ? null : form.donor_email || null,
      donor_phone: form.donor_phone || null,
      is_anonymous: form.is_anonymous,
      message: form.message || null,
      campaign_id: form.campaign_id || null,
    };

    try {
      const data = await api.post("/api/v1/donations", payload);
      setIntentResult(data);
      setStep("success");
    } catch (err) {
      setApiError(err.message || "Failed to create donation. Please try again.");
      setStep("error");
    } finally {
      setSubmitting(false);
    }
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

      <div className="bg-[#f6fef9] min-h-screen">
        <section className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Donate
          </p>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-[var(--brand-green)]">
            Support Brisk Farm Solutions
          </h1>
          <p className="mt-2 max-w-2xl text-xs md:text-sm text-[var(--brand-contrast)]/80">
            Your contribution helps us implement biodigester systems, waste management
            solutions, farm training and construction projects that keep households,
            farms and institutions resilient across Uganda.
          </p>

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-[var(--brand-green)]/10 p-5 md:p-8 space-y-6">
            {/* Optional campaigns notice */}
            {campaignsError && (
              <p className="text-xs text-red-600 mb-1">{campaignsError}</p>
            )}

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
              <DonationFailure
                message={apiError}
                onRetry={handleBackToForm}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
