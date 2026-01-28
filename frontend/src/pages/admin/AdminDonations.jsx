// src/pages/admin/AdminDonations.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../lib/apiClient";

const STATUS_OPTIONS = ["pending", "confirmed", "failed", "refunded"];

export default function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    campaign_id: "",
    status: "",
    date_from: "",
    date_to: "",
    min_amount: "",
    max_amount: "",
  });

  const loadCampaigns = async () => {
    try {
      const data = await api.get("/api/v1/campaigns");
      const items = Array.isArray(data) ? data : data?.items || [];
      setCampaigns(items);
    } catch {
      // ignore, admin can still see donations
    }
  };

  const loadDonations = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (filters.campaign_id) params.set("campaign_id", filters.campaign_id);
      if (filters.status) params.set("status", filters.status);
      if (filters.date_from) params.set("date_from", filters.date_from);
      if (filters.date_to) params.set("date_to", filters.date_to);
      if (filters.min_amount) params.set("min_amount", filters.min_amount);
      if (filters.max_amount) params.set("max_amount", filters.max_amount);

      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await api.get(`/api/v1/donations${query}`);
      const items = Array.isArray(data) ? data : data?.items || [];
      setDonations(items);
    } catch (err) {
      setError(err.message || "Failed to load donations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadDonations();
  };

  const handleClearFilters = () => {
    setFilters({
      campaign_id: "",
      status: "",
      date_from: "",
      date_to: "",
      min_amount: "",
      max_amount: "",
    });
    loadDonations();
  };

  const formatAmount = (amount, currency) => {
    if (!amount) return "—";
    return `${Number(amount).toLocaleString()} ${currency || "UGX"}`;
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  return (
    <AdminLayout title="Donations">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Donations
            </h1>
            <p className="text-xs text-slate-500">
              Review incoming donations by date, campaign, status and amount.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Filters */}
        <form
          onSubmit={handleApplyFilters}
          className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs"
        >
          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Campaign
              </label>
              <select
                name="campaign_id"
                value={filters.campaign_id}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1"
              >
                <option value="">All campaigns</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1"
              >
                <option value="">All</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Date from
              </label>
              <input
                type="datetime-local"
                name="date_from"
                value={filters.date_from}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Date to
              </label>
              <input
                type="datetime-local"
                name="date_to"
                value={filters.date_to}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Min amount (UGX)
              </label>
              <input
                type="number"
                min="0"
                name="min_amount"
                value={filters.min_amount}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Max amount (UGX)
              </label>
              <input
                type="number"
                min="0"
                name="max_amount"
                value={filters.max_amount}
                onChange={handleFilterChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3 py-1 rounded-lg border border-slate-200 text-[10px] text-slate-600"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700"
            >
              Apply filters
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          {loading ? (
            <p className="p-4 text-xs text-slate-500">Loading donations…</p>
          ) : donations.length === 0 ? (
            <p className="p-4 text-xs text-slate-500">
              No donations found for the selected filters.
            </p>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Date</th>
                  <th className="px-3 py-2 text-left font-semibold">Campaign</th>
                  <th className="px-3 py-2 text-right font-semibold">Amount</th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Method
                  </th>
                  <th className="px-3 py-2 text-center font-semibold">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">
                    Donor
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => {
                  const campaign = campaigns.find(
                    (c) => c.id === d.campaign_id
                  );
                  return (
                    <tr key={d.id} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-slate-700">
                        {formatDate(d.created_at)}
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {campaign?.name || "General support"}
                      </td>
                      <td className="px-3 py-2 text-right text-slate-900">
                        {formatAmount(d.amount, d.currency)}
                      </td>
                      <td className="px-3 py-2 text-center text-slate-600">
                        {d.payment_method || "—"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            d.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700"
                              : d.status === "failed"
                              ? "bg-red-50 text-red-700"
                              : d.status === "refunded"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-700">
                        {d.donor_name || "Anonymous"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

