// src/__tests__/ProjectsAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminProjects from "../pages/admin/AdminProjects.jsx";

// ✅ Mock the admin guard so it always allows access in tests
// (string here MUST match what AdminProjects.jsx imports)
vi.mock("../../components/layout/useRequireAdmin", () => ({
  __esModule: true,
  useRequireAdmin: () => ({
    isChecking: false,
    isAdmin: true,
  }),
}));

// 🔥 No ProjectsStore mock – we want the real store with projectsSeed

describe("AdminProjects", () => {
  it("renders admin projects shell with seeded projects", async () => {
    render(
      <MemoryRouter>
        <AdminProjects />
      </MemoryRouter>
    );

    // Header content (wrapped in act via findBy*)
    expect(
      await screen.findByText(/portfolio management/i)
    ).toBeInTheDocument();

    // These two slugs come from src/data/projectsData.js
    expect(
      await screen.findByText(/kasese-biodigester-dairy-farm/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/wakiso-biogas-appliances-upgrade/i)
    ).toBeInTheDocument();
  });
});
