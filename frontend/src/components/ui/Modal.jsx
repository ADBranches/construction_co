// src/components/ui/Modal.jsx
export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-[var(--brand-contrast,#1f1f1f)]/70 backdrop-blur-sm"
      />

      {/* Modal content */}
      <div
        className="
          relative z-10 w-[90%] max-w-lg rounded-2xl
          border border-[var(--brand-green)]/25
          bg-[var(--brisk-cream,#f6fef9)] p-6
          shadow-[var(--shadow-lg)]
          transform transition-all duration-200
          scale-100 opacity-100
        "
      >
        {children}
      </div>
    </div>
  );
}
