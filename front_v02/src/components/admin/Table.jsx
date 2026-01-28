// src/components/admin/Table.jsx
export default function AdminTable({ columns = [], children, emptyLabel }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--brand-contrast,#1f1f1f)]/10 bg-white shadow-sm">
      <table className="min-w-full text-left text-xs">
        <thead className="border-b border-[var(--brand-contrast,#1f1f1f)]/10 bg-[#f6fef9]">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 font-semibold uppercase tracking-[0.16em] text-[var(--brand-contrast,#1f1f1f)]/70"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--brand-contrast,#1f1f1f)]/5">
          {children}
        </tbody>
      </table>

      {emptyLabel && !children && (
        <div className="px-4 py-3 text-xs text-[var(--brand-contrast,#1f1f1f)]/70">
          {emptyLabel}
        </div>
      )}
    </div>
  );
}
