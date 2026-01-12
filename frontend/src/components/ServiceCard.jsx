// src/components/ServiceCard.jsx
import { motion } from "framer-motion";

export default function ServiceCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer rounded-xl border border-[#2f8f2f]/25 bg-[#fdfcf7] p-6 shadow-sm hover:shadow-xl"
    >
      <div className="mb-4 text-4xl text-[#2f8f2f]">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-[#1f1f1f]">{title}</h3>
      <p className="text-sm text-[#4b5563]">{description}</p>
    </motion.div>
  );
}
