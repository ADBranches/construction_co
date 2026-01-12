// src/components/ui/Table.jsx
export default function Table({ columns = [], data = [] }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--brand-green)] text-left text-xs font-semibold uppercase tracking-[0.14em] text-white">
            {columns.map((col) => (
              <th key={col} className="px-4 py-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="px-4 py-4 text-center text-xs text-gray-500"
              >
                No records found.
              </td>
            </tr>
          )}

          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-gray-200 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100 transition-colors`}
            >
              {Object.values(row).map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[var(--brand-contrast)] text-xs md:text-sm">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
