// src/components/ui/Input.jsx
export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#1f1f1f]">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-lg border px-4 py-2 text-sm text-[#1f1f1f] shadow-sm
          bg-[#fdfcf7] placeholder:text-[#9ca3af]
          focus:outline-none focus:ring-2 focus:ring-[#2f8f2f] focus:border-[#2f8f2f]
          ${
            error
              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-[#d1d5db]"
          }
          ${className}`}
      />
      {error && (
        <p className="mt-1 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
