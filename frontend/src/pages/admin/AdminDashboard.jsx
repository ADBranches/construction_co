// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../lib/apiClient";
import { authHeader } from "../../lib/auth";
import { useRequireAdmin } from "../../components/layout/useRequireAdmin";
import AdminLayout from "../../components/layout/AdminLayout";
import StatCard from "../../components/admin/StatCard";

export default function AdminDashboard() {
  useRequireAdmin(); // 🔐 Centralized route protection

  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    openInquiries: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      try {
        const headers = authHeader();

        const [services, projectStats, inquiryStats] = await Promise.all([
          // Public, but we still send auth in case you secure later
          api.get("/api/v1/services", { headers }),
          api.get("/api/v1/projects/stats", { headers }),
          api.get("/api/v1/inquiries/stats", { headers }),
        ]);

        if (!mounted) return;

        setStats({
          services: Array.isArray(services) ? services.length : 0,
          projects: projectStats?.total ?? 0,
          openInquiries: inquiryStats?.open ?? inquiryStats?.total ?? 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-4">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-yellow)]">
            Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--brand-contrast)]">
            Brisk CMS Overview
          </h1>
          <p className="mt-2 text-xs text-[var(--brand-contrast)]/80">
            A real-time snapshot of Brisk’s services, project portfolio, and
            client inquiries.
          </p>
        </header>

        {/* Stats */}
        {loading ? (
          <p className="text-xs text-[var(--brand-contrast)]/70">
            Loading dashboard metrics…
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Services"
              value={stats.services}
              color="green"
            />
            <StatCard
              label="Projects"
              value={stats.projects}
              color="orange"
            />
            <StatCard
              label="Open Inquiries"
              value={stats.openInquiries}
              color="blue"
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
