// src/components/admin/DashboardDonationsWidget.jsx
import { useEffect, useState } from "react";
import api from "../../lib/apiClient";
import StatCard from "./StatCard";

export default function DashboardDonationsWidget() {
  const [summary, setSummary] = useState({
    month_total: 0,
    donors_count: 0,
    top_campaign: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/api/v1/stats/donations/summary")
      .then((data) => {
        if (!isMounted) return;
        setSummary({
          month_total: data.month_total || 0,
          donors_count: data.donors_count || 0,
          top_campaign: data.top_campaign || null,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load donation stats.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-4 text-xs text-slate-500">Loading donation stats…</div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 text-xs text-red-600">
        {error} – donation stats unavailable.
      </div>
    );
  }

  const monthTotalDisplay = summary.month_total.toLocaleString("en-UG");
  const donorsDisplay = summary.donors_count.toString();
  const topCampaignName =
    summary.top_campaign?.name || "No campaign yet";

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <StatCard
        label="Donations this month"
        value={`${monthTotalDisplay} UGX`}
        helper="Confirmed donations from 1st of this month."
      />
      <StatCard
        label="Donors this month"
        value={donorsDisplay}
        helper="Unique donor emails this month."
      />
      <StatCard
        label="Top campaign"
        value={topCampaignName}
        helper="Highest total confirmed amount (all time)."
      />
    </div>
  );
}

