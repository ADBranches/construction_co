// src/components/admin/DashboardDonationsWidget.jsx
import { useEffect, useState } from "react";
import DonationsStore from "../../lib/donationsStore";
import CampaignsStore from "../../lib/campaignsStore";
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
    try {
      const all = DonationsStore.list();
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const confirmed = all.filter((d) => d.status === "confirmed");

      const isInMonth = (d) => {
        const iso = d.createdAt || d.created_at;
        if (!iso) return false;
        const created = new Date(iso);
        return created >= monthStart && created <= monthEnd;
      };

      const monthDonations = confirmed.filter(isInMonth);

      const monthTotal = monthDonations.reduce(
        (sum, d) => sum + (Number(d.amount) || 0),
        0
      );

      const donorEmails = new Set(
        monthDonations
          .map((d) => d.donor_email)
          .filter((email) => typeof email === "string" && email.length > 0)
      );

      const totalsByCampaign = new Map();
      confirmed.forEach((d) => {
        const cid = d.campaign_id || d.campaignId;
        if (!cid) return;
        const prev = totalsByCampaign.get(cid) || 0;
        totalsByCampaign.set(cid, prev + (Number(d.amount) || 0));
      });

      let topCampaign = null;
      let maxTotal = 0;

      totalsByCampaign.forEach((total, cid) => {
        if (total > maxTotal) {
          maxTotal = total;
          const campaign = CampaignsStore.getById
            ? CampaignsStore.getById(cid)
            : null;
          topCampaign = campaign
            ? { id: cid, name: campaign.name, total_amount: total }
            : { id: cid, name: "Unnamed campaign", total_amount: total };
        }
      });

      setSummary({
        month_total: monthTotal,
        donors_count: donorEmails.size,
        top_campaign: topCampaign,
      });
      setLoading(false);
    } catch (err) {
      setError(err?.message || "Failed to load donation stats.");
      setLoading(false);
    }
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

