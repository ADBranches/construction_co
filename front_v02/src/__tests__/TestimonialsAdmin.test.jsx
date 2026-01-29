// src/__tests__/TestimonialsAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminTestimonials from "../pages/admin/AdminTestimonials.jsx";

// ✅ Mock the admin guard – always allow access in tests
vi.mock("../../components/layout/useRequireAdmin", () => ({
  __esModule: true,
  useRequireAdmin: () => ({
    isChecking: false,
    isAdmin: true,
  }),
}));

// ✅ Mock TestimonialsStore inside the factory (no top-level mockStore var)
vi.mock("../../lib/testimonialsStore", () => {
  const mockStore = {
    listAdmin: vi.fn(() => [
      {
        id: "t-1",
        client_name: "Happy Farmer",
        role: "Dairy farmer",
        content: "Brisk transformed our biogas system.",
        is_active: true,
        display_order: 1,
      },
    ]),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  return {
    __esModule: true,
    default: mockStore,
  };
});

describe("AdminTestimonials", () => {
  it("renders admin testimonials shell", () => {
    render(
      <MemoryRouter>
        <AdminTestimonials />
      </MemoryRouter>
    );

    // 🎯 Use the unique heading instead of generic "Testimonials"
    const heading = screen.getByRole("heading", {
      name: /Client Feedback CMS/i,
    });
    expect(heading).toBeInTheDocument();

    // Optional: also assert on the empty-state copy
    expect(
      screen.getByText(/No testimonials yet/i)
    ).toBeInTheDocument();
  });
});
