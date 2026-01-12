// src/components/ui/Modal.jsx
import { motion } from "framer-motion";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1f1f1f]/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-[90%] max-w-lg rounded-2xl border border-[#2f8f2f]/25 bg-[#fdfcf7] p-6 shadow-2xl"
      >
        {children}
      </motion.div>
    </div>
  );
}
