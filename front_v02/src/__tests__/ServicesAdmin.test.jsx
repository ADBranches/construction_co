// src/__tests__/ServicesAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminServices from "../pages/admin/AdminServices.jsx";

// Mock ServicesStore – this replaces any real localStorage/logic during the test
vi.mock("../lib/servicesStore", () => ({
  __esModule: true,
  default: {
    list: vi.fn(() => [
      {
        id: "1",
        name: "BioGas",
        slug: "biogas",
        short_description: "desc",
      },
    ]),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

describe("Admin Services", () => {
  it("renders service list", async () => {
    render(
      <MemoryRouter>
        <AdminServices />
      </MemoryRouter>
    );

    // Should show the mocked service name
    expect(await screen.findByText("BioGas")).toBeTruthy();
  });
});
