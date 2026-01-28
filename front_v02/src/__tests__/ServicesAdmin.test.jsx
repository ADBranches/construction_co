// src/__tests__/ServicesAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminServices from "../pages/admin/AdminServices.jsx";

// Mock fetch globally to behave like a real Response
vi.stubGlobal("fetch", (url, opts) => {
  // Mock the services list endpoint
  if (typeof url === "string" && url.includes("/api/v1/services")) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => [
        {
          id: "1",
          name: "BioGas",
          slug: "biogas",
          short_description: "desc",
        },
      ],
      text: async () => "", // used only on error path
    });
  }

  // Default mock for any other fetch
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => "",
  });
});

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
