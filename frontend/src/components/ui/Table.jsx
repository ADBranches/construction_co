// src/components/ui/Table.jsx
export default function Table({ columns = [], data = [] }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#2f8f2f] text-left text-xs font-semibold uppercase tracking-[0.14em] text-white">
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
                className="px-4 py-4 text-center text-xs text-[#6b7280]"
              >
                No records found.
              </td>
            </tr>
          )}

          {data.map((row, i) => (
            <tr
              key={i}
              className={`border-t border-[#e5e7eb] ${
                i % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"
              } hover:bg-[#f3f4f6]`}
            >
              {Object.values(row).map((cell, j) => (
                <td key={j} className="px-4 py-3 text-[#1f1f1f]">
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
