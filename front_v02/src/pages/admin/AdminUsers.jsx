// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import UsersStore from "../../lib/usersStore";
import AdminTable from "../../components/admin/Table";

function AdminUsers() {
  useRequireAdmin();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  const loadUsers = async () => {
     setLoading(true);
     setError("");
 
     try {
       const data = UsersStore.list();
       setUsers(Array.isArray(data) ? data : []);
     } catch (err) {
       setError(err?.message || "Failed to load users.");
     } finally {
       setLoading(false);
     }
   };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateLocalField = (id, field, value) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const handleUpdate = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    setSavingId(id);
    setError("");

    try {
      // Front-only demo: persist role change via UsersStore
      const updated = UsersStore.updateRole(id, user.role || "staff");

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
      );
    } catch (err) {
      setError(err.message || "Failed to update user.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Users
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            Admin &amp; Staff Management
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/80 max-w-xl">
            View team accounts and adjust their permissions. Only admins can
            promote/demote users between <strong>staff</strong> and{" "}
            <strong>admin</strong>.
          </p>
        </header>

        {/* Status */}
        {loading && (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading users...
          </p>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}

        {/* Table */}
        {!loading && !error && (
          <AdminTable
            columns={["Name", "Email", "Role", "Superuser", "Active", "Actions"]}
            emptyLabel="No users found."
          >
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-3 text-xs text-[var(--brand-contrast)]/70"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  {/* Name */}
                  <td className="px-4 py-3 text-xs text-[var(--brand-contrast)]">
                    {user.full_name || "—"}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3 text-xs text-[var(--brand-contrast)]/80">
                    {user.email}
                  </td>

                  {/* Role select */}
                  <td className="px-4 py-3 text-xs">
                    <select
                      value={user.role || "staff"}
                      onChange={(e) =>
                        updateLocalField(user.id, "role", e.target.value)
                      }
                      className="rounded-lg border border-[var(--brand-contrast)]/20 bg-[#f6fef9] px-2 py-1 text-xs outline-none"
                    >
                      <option value="staff" className="capitalize">
                        staff
                      </option>
                      <option value="admin" className="capitalize">
                        admin
                      </option>
                    </select>
                  </td>

                  {/* Superuser toggle */}
                  <td className="px-4 py-3 text-xs">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!user.is_superuser}
                        onChange={(e) =>
                          updateLocalField(
                            user.id,
                            "is_superuser",
                            e.target.checked
                          )
                        }
                        className="h-3 w-3 rounded border-[var(--brand-contrast)]/30"
                      />
                      <span className="text-[10px] text-[var(--brand-contrast)]/70">
                        Full power
                      </span>
                    </label>
                  </td>

                  {/* Active flag */}
                  <td className="px-4 py-3 text-xs text-[var(--brand-contrast)]/70">
                    {user.is_active ? "Active" : "Disabled"}
                  </td>

                  {/* Action */}
                  <td className="px-4 py-3 text-right text-xs">
                    <button
                      type="button"
                      onClick={() => handleUpdate(user.id)}
                      disabled={savingId === user.id}
                      className="rounded-lg bg-[var(--brand-green,#1a8f4b)] px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-[var(--brand-green-dark,#0f6b35)] disabled:opacity-60"
                    >
                      {savingId === user.id
                        ? "Saving..."
                        : user.is_superuser
                        ? "Save"
                        : "Update"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        )}

        {!loading && !error && users.length > 0 && (
          <p className="text-[11px] text-[var(--brand-contrast)]/60">
            Total users:{" "}
            <span className="font-semibold text-[var(--brand-contrast)]">
              {users.length}
            </span>
          </p>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminUsers;
