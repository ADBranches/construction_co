// src/components/admin/InquiriesTable.jsx
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_review", label: "In review" },
  { value: "quoted", label: "Quoted" },
  { value: "closed", label: "Closed" },
];

function StatusPill({ status }) {
  const normalized = (status || "new").toLowerCase();
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]";
  let styles = "bg-slate-100 text-slate-700 border border-slate-200";

  if (normalized === "new") {
    styles = "bg-emerald-50 text-emerald-700 border border-emerald-200";
  } else if (normalized === "in_review") {
    styles = "bg-amber-50 text-amber-700 border border-amber-200";
  } else if (normalized === "quoted") {
    styles = "bg-sky-50 text-sky-700 border border-sky-200";
  } else if (normalized === "closed") {
    styles = "bg-slate-900 text-slate-100 border border-slate-900";
  }

  const label =
    (status || "new").toString().replace("_", " ") || "new";

  return <span className={`${base} ${styles}`}>{label}</span>;
}

export default function InquiriesTable({
  inquiries = [],
  onStatusChange,
  onSaveNotes,
}) {
  const [notesDraft, setNotesDraft] = useState({});

  if (!Array.isArray(inquiries) || inquiries.length === 0) {
    return (
      <div className="brand-card p-4 text-xs text-[var(--brand-contrast)]/70">
        No inquiries have been received yet. Once clients submit contact or
        quote forms, they will appear here.
      </div>
    );
  }

  const handleNotesChange = (id, value) => {
    setNotesDraft((prev) => ({ ...prev, [id]: value }));
  };

  const handleNotesSave = (id) => {
    const value = notesDraft[id];
    if (typeof onSaveNotes === "function") {
      onSaveNotes(id, value || "");
    }
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--brand-green)]/15 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-[var(--brand-contrast)]/5 text-xs">
        <thead className="bg-[var(--brand-contrast)]/3">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-[var(--brand-contrast)]">
              Client
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--brand-contrast)]">
              Contact
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--brand-contrast)]">
              Source
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--brand-contrast)]">
              Status
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--brand-contrast)]">
              Message
            </th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--brand-contrast)]">
              Internal Notes
            </th>
            <th className="px-4 py-3 text-right font-semibold text-[var(--brand-contrast)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--brand-contrast)]/5">
          {inquiries.map((inq) => {
            const id = inq.id;
            const created =
              inq.created_at ||
              inq.createdAt ||
              inq.created ||
              inq.timestamp;
            const notesValue =
              notesDraft[id] ?? inq.internal_notes ?? "";

            return (
              <tr key={id}>
                {/* Client + created date */}
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-[var(--brand-contrast)]">
                    {inq.full_name || inq.name || "-"}
                  </div>
                  {created && (
                    <div className="text-[11px] text-[var(--brand-contrast)]/60">
                      {new Date(created).toLocaleDateString()}
                    </div>
                  )}
                </td>

                {/* Contact (email + phone) */}
                <td className="px-4 py-3 align-top">
                  <div className="text-[var(--brand-contrast)]/80">
                    {inq.email || "-"}
                  </div>
                  {inq.phone && (
                    <div className="text-[11px] text-[var(--brand-contrast)]/60">
                      {inq.phone}
                    </div>
                  )}
                </td>

                {/* Source */}
                <td className="px-4 py-3 align-top">
                  <span className="rounded-full bg-[#f6fef9] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-contrast)]/70">
                    {inq.source || "contact"}
                  </span>
                </td>

                {/* Status + selector */}
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-1">
                    <StatusPill status={inq.status} />
                    <select
                      value={inq.status || "new"}
                      onChange={(e) =>
                        onStatusChange &&
                        onStatusChange(id, e.target.value)
                      }
                      className="mt-1 rounded-lg border border-[var(--brand-contrast)]/15 bg-white px-2 py-1 text-[10px] outline-none focus:border-[var(--brand-green)]"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>

                {/* Message */}
                <td className="px-4 py-3 align-top max-w-xs">
                  <p className="text-[var(--brand-contrast)]/80 line-clamp-4">
                    {inq.message || "-"}
                  </p>
                </td>

                {/* Internal notes */}
                <td className="px-4 py-3 align-top">
                  <textarea
                    rows={3}
                    value={notesValue}
                    onChange={(e) =>
                      handleNotesChange(id, e.target.value)
                    }
                    className="w-full rounded-xl border border-[var(--brand-contrast)]/15 bg-[#f6fef9] px-2 py-1 text-[11px] outline-none focus:border-[var(--brand-green)] resize-none"
                    placeholder="Internal notes (not visible to client)..."
                  />
                </td>

                {/* Actions */}
                <td className="px-4 py-3 align-top text-right">
                  <button
                    type="button"
                    onClick={() => handleNotesSave(id)}
                    className="rounded-full bg-[var(--brand-green)] px-3 py-1 text-[10px] font-semibold text-white shadow hover:bg-[var(--brand-green-dark,#08533c)]"
                  >
                    Save Notes
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
