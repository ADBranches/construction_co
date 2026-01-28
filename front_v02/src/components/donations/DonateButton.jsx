// src/components/donations/DonateButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function DonateButton({ label = "Donate Now", campaignSlug }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (campaignSlug) {
      navigate(`/donate?campaign=${encodeURIComponent(campaignSlug)}`);
    } else {
      navigate("/donate");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-full bg-[var(--brand-yellow)] px-5 py-2 text-xs md:text-sm font-semibold text-white hover:bg-[#f05010] transition"
    >
      {label}
    </button>
  );
}
