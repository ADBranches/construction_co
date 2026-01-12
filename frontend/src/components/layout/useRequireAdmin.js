// src/components/layout/useRequireAdmin.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../lib/auth.js";

export function useRequireAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/admin/login");
    }
  }, [navigate]);
}
