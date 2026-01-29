// src/pages/admin/AdminCampaigns.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import CampaignsStore from "../../lib/campaignsStore"; 
import DonationsStore from "../../lib/donationsStore";

const STATUS_OPTIONS = ["draft", "active", "closed"];

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    slug: "",
    target_amount: "",
    status: "draft",
    is_edit: false,
  });

  const loadCampaigns = (statusValue = "") => {
    setLoading(true);
    setError("");

    try {
      const all = CampaignsStore.list();
      const filtered = statusValue
        ? all.filter((c) => c.status === statusValue)
        : all;

      const withRaised = filtered.map((c) => {
        const confirmed = DonationsStore
          .listByCampaign(c.id)
          .filter((d) => d.status === "confirmed");

        const total = confirmed.reduce(
          (sum, d) => sum + (Number(d.amount) || 0),
          0
        );

        return {
          ...c,
          raised_amount: total,
        };
      });

      setCampaigns(withRaised);
    } catch (err) {
      setError(err?.message || "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns(filterStatus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      slug: "",
      target_amount: "",
      status: "draft",
      is_edit: false,
    });
  };

  const handleEdit = (campaign) => {
    setForm({
      id: campaign.id,
      name: campaign.name,
      slug: campaign.slug,
      target_amount: campaign.target_amount || "",
      status: campaign.status || "draft",
      is_edit: true,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name,
      slug: form.slug,
      target_amount: form.target_amount
        ? Number(form.target_amount)
        : null,
      status: form.status,
      isActive: form.status === "active",
    };

    try {
      if (form.is_edit && form.id) {
        CampaignsStore.update(form.id, payload);
      } else {
        CampaignsStore.create(payload);
      }
      resetForm();
      loadCampaigns(filterStatus);
    } catch (err) {
      setError(err?.message || "Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Campaigns">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Donation Campaigns
            </h1>
            <p className="text-xs text-slate-500">
              Create and manage campaign buckets that donations can be linked to.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600">Status:</label>
            <select
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs"
        >
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                placeholder="Biogas for Schools"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Slug
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                placeholder="biogas-for-schools"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Target amount (UGX)
              </label>
              <input
                type="number"
                min="0"
                name="target_amount"
                value={form.target_amount}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 px-2 py-1 text-xs"
                placeholder="100000000"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              {form.is_edit && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-[10px] text-slate-600"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700 disabled:opacity-70"
              >
                {saving
                  ? "Saving..."
                  : form.is_edit
                  ? "Update campaign"
                  : "Create campaign"}
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          {loading ? (
            <p className="p-4 text-xs text-slate-500">Loading campaigns…</p>
          ) : campaigns.length === 0 ? (
            <p className="p-4 text-xs text-slate-500">
              No campaigns yet. Use the form above to create one.
            </p>
          ) : (
            <table className="min-w-full text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Name</th>
                  <th className="px-3 py-2 text-left font-semibold">Slug</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Target (UGX)
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Raised (UGX)
                  </th>
                  <th className="px-3 py-2 text-center font-semibold">Status</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-800">{c.name}</td>
                    <td className="px-3 py-2 text-slate-500">{c.slug}</td>
                    <td className="px-3 py-2 text-right text-slate-800">
                      {c.target_amount
                        ? Number(c.target_amount).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">
                      {c.raised_amount
                        ? Number(c.raised_amount).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          c.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : c.status === "closed"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="text-[10px] font-semibold text-emerald-700 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

