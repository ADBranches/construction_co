// src/components/layout/useRequireAdmin.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, isAdmin } from "../../lib/auth.js";

export function useRequireAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const user = await getCurrentUser();
      if (cancelled) return;

      if (!user || !isAdmin(user)) {
        navigate("/admin/login");
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [navigate]);
}
