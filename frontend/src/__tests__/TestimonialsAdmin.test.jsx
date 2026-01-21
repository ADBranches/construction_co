// src/__tests__/TestimonialsAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminTestimonials from "../pages/admin/AdminTestimonials.jsx";

// Bypass the admin route guard in tests
vi.mock("../components/layout/useRequireAdmin.js", () => ({
  useRequireAdmin: () => {},
}));

// Stub global fetch used by apiClient
vi.stubGlobal("fetch", (url) => {
  const href = typeof url === "string" ? url : url?.url ?? "";

  if (href.includes("/api/v1/testimonials")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "test-t1",
            client_name: "Happy Farmer",
            client_role: "Dairy Farmer",
            company: "Kasese Hills Farm",
            message: "Brisk helped us turn waste into reliable biogas.",
            rating: 5,
            is_active: true,
            is_featured: true,
            display_order: 1,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
          },
        ]),
    });
  }

  // default fallback
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

describe("AdminTestimonials", () => {
  it("renders testimonials from API", async () => {
    render(
      <MemoryRouter>
        <AdminTestimonials />
      </MemoryRouter>
    );

    expect(await screen.findByText("Happy Farmer")).toBeTruthy();
    expect(
      await screen.findByText("Brisk helped us turn waste into reliable biogas.")
    ).toBeTruthy();
  });
});
