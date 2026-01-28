// src/pages/admin/AdminInquiries.jsx
import { useEffect, useState } from "react";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import InquiriesTable from "../../components/admin/InquiriesTable";

function AdminInquiries() {
  useRequireAdmin();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New filters for mini-CRM
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadInquiries = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (sourceFilter !== "all") {
        params.append("source", sourceFilter);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      // keep your old behavior: cap to 100, good for admin table
      params.append("limit", "100");

      const queryString = params.toString();
      const path = queryString
        ? `/api/v1/inquiries?${queryString}`
        : "/api/v1/inquiries";

      const payload = await api.get(path, {
        headers: authHeader(),
      });

      // harmonized: support both array OR paginated { items: [...] }
      const items = Array.isArray(payload) ? payload : payload?.items || [];
      setInquiries(items);
    } catch (err) {
      setError(err.message || "Failed to load inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, sourceFilter, search]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // mini-CRM style: use InquiryUpdate via PUT
      await api.put(
        `/api/v1/inquiries/${id}`,
        { status: newStatus },
        { headers: authHeader() }
      );
      await loadInquiries();
    } catch (err) {
      alert(err.message || "Failed to update status.");
    }
  };

  const handleSaveNotes = async (id, notes) => {
    try {
      await api.put(
        `/api/v1/inquiries/${id}`,
        { internal_notes: notes },
        { headers: authHeader() }
      );
      await loadInquiries();
    } catch (err) {
      alert(err.message || "Failed to save notes.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Inquiries
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            Client Inquiries &amp; Quotes
          </h1>
          <p className="mt-2 max-w-xl text-xs text-[var(--brand-contrast)]/80">
            View all requests from the website. Update statuses (NEW → IN_REVIEW
            → QUOTED → CLOSED) and keep internal notes for your team.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[var(--brand-contrast)]/20 bg-white px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="in_review">In review</option>
              <option value="quoted">Quoted</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-xl border border-[var(--brand-contrast)]/20 bg-white px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)]"
            >
              <option value="all">All sources</option>
              <option value="quote">Quote page</option>
              <option value="contact">Contact page</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search name, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-2 text-xs outline-none focus:border-[var(--brand-green)] md:w-72"
          />
        </div>

        {/* Table / states */}
        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading inquiries...
          </p>
        )}

        {error && <p className="text-xs text-red-600">{error}</p>}

        {!loading && !error && inquiries.length > 0 && (
          <InquiriesTable
            inquiries={inquiries}
            onStatusChange={handleStatusChange}
            onSaveNotes={handleSaveNotes}
          />
        )}

        {!loading && !error && inquiries.length === 0 && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            No inquiries found for the current filters. Once visitors submit
            contact or quote forms, they will appear here.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminInquiries;
