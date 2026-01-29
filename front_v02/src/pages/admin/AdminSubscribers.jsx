// src/pages/admin/AdminSubscribers.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import AdminTable from "../../components/admin/Table";
import SubscribersStore from "../../lib/subscribersStore";

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

function AdminSubscribers() {
  useRequireAdmin();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubscribers = () => {
    setLoading(true);
    setError("");

    try {
      const items = SubscribersStore.list();

      // sort newest first by createdAt/created_at
      const sorted = [...items].sort((a, b) => {
        const aDate = new Date(a.createdAt || a.created_at || 0).getTime();
        const bDate = new Date(b.createdAt || b.created_at || 0).getTime();
        return bDate - aDate;
      });

      setSubscribers(sorted);
    } catch (err) {
      setError(err.message || "Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Remove this subscriber?")) return;

    try {
      SubscribersStore.removeById(id);
      loadSubscribers();
    } catch (err) {
      alert(err.message || "Failed to remove subscriber.");
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Newsletter
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            Subscribers List
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/80 max-w-xl">
            View people who have opted in to receive updates from Brisk Farm
            Solutions. You can export this list from your database or integrate
            with an email provider later.
          </p>
        </header>

        {/* Status */}
        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading subscribers...
          </p>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}

        {/* Table */}
        {!loading && !error && (
          <AdminTable
            columns={["Email", "Subscribed At", "Subscriber ID", "Actions"]}
            emptyLabel="No subscribers found yet."
          >
            {subscribers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-3 text-xs text-[var(--brand-contrast)]/70"
                >
                  No subscribers found yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-4 py-3 text-xs text-[var(--brand-contrast)]">
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--brand-contrast)]/70">
                    {formatDate(sub.created_at || sub.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-[var(--brand-contrast)]/50">
                    {sub.id}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(sub.id)}
                      className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        )}

        {!loading && !error && subscribers.length > 0 && (
          <p className="text-[11px] text-[var(--brand-contrast)]/60">
            Total subscribers:{" "}
            <span className="font-semibold text-[var(--brand-contrast)]">
              {subscribers.length}
            </span>
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminSubscribers;
