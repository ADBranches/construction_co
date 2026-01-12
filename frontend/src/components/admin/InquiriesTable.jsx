// src/components/admin/InquiriesTable.jsx
export default function InquiriesTable({ inquiries = [], onResolve }) {
  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
  };

  const renderStatusPill = (status = "") => {
    const normalized = status.toLowerCase();

    let classes =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold";

    if (normalized === "resolved") {
      classes +=
        " bg-[var(--brand-green)]/10 text-[var(--brand-green)] border border-[var(--brand-green)]/30";
    } else if (normalized === "pending") {
      classes +=
        " bg-[var(--brand-yellow)]/10 text-[var(--brand-yellow)] border border-[var(--brand-yellow)]/30";
    } else {
      // default / new
      classes +=
        " bg-[var(--brand-earth)]/10 text-[var(--brand-earth)] border border-[var(--brand-earth)]/30";
    }

    return <span className={classes}>{status || "new"}</span>;
  };

  if (!inquiries.length) {
    return (
      <div className="rounded-xl border border-[var(--brand-green)]/15 bg-white p-4 text-xs text-[var(--brand-contrast)]/70">
        No inquiries have been received yet. Once clients submit contact or
        quote forms, they will appear here.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--brand-green)]/15 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--brand-green)] text-[#fdfcf7] text-xs uppercase tracking-[0.16em]">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Message</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 w-28 text-right"></th>
          </tr>
        </thead>

        <tbody>
          {inquiries.map((i, idx) => {
            const created =
              i.created_at || i.createdAt || i.created || i.timestamp;

            return (
              <tr
                key={i.id || idx}
                className="border-t border-[var(--brand-green)]/10 hover:bg-[var(--brand-green)]/3"
              >
                <td className="p-3 align-top text-[var(--brand-contrast)] text-xs">
                  {i.full_name || i.name || "-"}
                </td>
                <td className="p-3 align-top text-[var(--brand-contrast)] text-xs">
                  {i.email || "-"}
                </td>
                <td className="p-3 align-top text-[var(--brand-contrast)]/80 text-xs max-w-xs">
                  <p className="line-clamp-3">{i.message || "-"}</p>
                </td>
                <td className="p-3 align-top text-xs">
                  {renderStatusPill(i.status)}
                </td>
                <td className="p-3 align-top text-[var(--brand-contrast)]/60 text-[11px]">
                  {formatDate(created)}
                </td>
                <td className="p-3 align-top text-right">
                  {i.status !== "resolved" && onResolve && (
                    <button
                      onClick={() => onResolve(i.id)}
                      className="text-[11px] font-semibold text-[var(--brand-green)] hover:underline"
                    >
                      Mark as resolved
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
