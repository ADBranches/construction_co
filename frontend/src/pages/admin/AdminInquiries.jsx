// src/pages/admin/AdminInquiries.jsx
import { useEffect, useState } from "react";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import PrimaryButton from "../../components/ui/PrimaryButton";

const STATUS_OPTIONS = ["NEW", "IN_REVIEW", "QUOTED", "CLOSED"];

function AdminInquiries() {
  useRequireAdmin();

  const [inquiries, setInquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState("NEW");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [statusMap, setStatusMap] = useState({});

    const loadInquiries = async () => {
      setLoading(true);
      setError("");
      setMessage("");

      const query =
        statusFilter && statusFilter !== "ALL"
          ? `?status=${encodeURIComponent(statusFilter)}&limit=100`
          : "?limit=100";

      try {
        const payload = await api.get(`/api/v1/inquiries${query}`, {
          headers: authHeader(),
        });

        const items = payload?.items || [];

        setInquiries(items);

        const initial = {};
        items.forEach((inq) => {
          initial[inq.id] = inq.status;
        });
        setStatusMap(initial);
      } catch (err) {
        setError(err.message || "Failed to load inquiries.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id) => {
    const newStatus = statusMap[id];
    if (!newStatus) return;

    setUpdatingId(id);
    setMessage("");

    try {
      await api.patch(
        `/api/v1/inquiries/${id}/status?status=${encodeURIComponent(
          newStatus
        )}`,
        {},
        { headers: authHeader() }
      );

      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, status: newStatus } : inq
        )
      );

      setMessage("Inquiry updated successfully.");
    } catch (err) {
      setMessage(err.message || "Failed to update inquiry.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
              Inquiries
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
              Website Leads &amp; Requests
            </h1>
            <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
              Review and update incoming inquiries from the Brisk public site –
              quotes, contact messages, and project requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--brand-contrast)]/70">
              Filter:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-3 py-1 text-xs outline-none focus:border-[var(--brand-green)]"
            >
              <option value="NEW">NEW</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="QUOTED">QUOTED</option>
              <option value="CLOSED">CLOSED</option>
              <option value="ALL">ALL</option>
            </select>
          </div>
        </header>

        {/* Status messages */}
        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading inquiries...
          </p>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
        {message && !error && (
          <p className="text-xs text-[var(--brand-contrast)]/80">{message}</p>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-2xl border border-[var(--brand-green)]/15 bg-white shadow-sm">
            <table className="min-w-full border-separate border-spacing-0 text-left text-xs">
              <thead className="bg-[var(--brand-green)]/5 text-[var(--brand-contrast)]/80">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Request</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {inquiries.map((inq, idx) => (
                  <tr
                    key={inq.id}
                    className={
                      idx % 2 === 1 ? "bg-[var(--brand-green)]/3" : "bg-white"
                    }
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-[var(--brand-contrast)]">
                        {inq.full_name || "-"}
                      </div>
                      <div className="text-[10px] text-[var(--brand-contrast)]/60">
                        {inq.created_at &&
                          new Date(inq.created_at).toLocaleString()}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[11px] text-[var(--brand-contrast)]/80">
                      {inq.phone && <div>📞 {inq.phone}</div>}
                      {inq.email && <div>✉️ {inq.email}</div>}
                      {inq.location && (
                        <div className="text-[10px]">📍 {inq.location}</div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-[var(--brand-contrast)]/80">
                      {inq.project_type && (
                        <div className="font-medium">{inq.project_type}</div>
                      )}
                      {inq.message && (
                        <div className="mt-1 line-clamp-3 text-[10px]">
                          {inq.message}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-[11px] text-[var(--brand-contrast)]/80">
                      {inq.budget_range || "-"}
                    </td>

                    <td className="px-4 py-3 text-[11px]">
                      <select
                        value={statusMap[inq.id] || inq.status}
                        onChange={(e) =>
                          setStatusMap((prev) => ({
                            ...prev,
                            [inq.id]: e.target.value,
                          }))
                        }
                        className="rounded-full border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-2 py-1 text-[11px] outline-none focus:border-[var(--brand-green)]"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <PrimaryButton
                        type="button"
                        className="px-3 py-1 text-[10px]"
                        onClick={() => handleUpdateStatus(inq.id)}
                        loading={updatingId === inq.id}
                      >
                        {updatingId === inq.id ? "Updating..." : "Update"}
                      </PrimaryButton>
                    </td>
                  </tr>
                ))}

                {inquiries.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-xs text-[var(--brand-contrast)]/70"
                    >
                      No inquiries found. Once visitors submit contact or quote
                      forms, they will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminInquiries;
