// src/__tests__/SubscribersAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import AdminSubscribers from "../pages/admin/AdminSubscribers.jsx";

// Bypass the admin guard in tests
vi.mock("../components/layout/useRequireAdmin.js", () => ({
  useRequireAdmin: () => {},
}));

// Stub global fetch used by apiClient
vi.stubGlobal("fetch", (url) => {
  const href = typeof url === "string" ? url : url?.url ?? "";

  if (href.includes("/api/v1/subscribers")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "sub-1",
            email: "client1@example.com",
            created_at: "2024-01-01T12:00:00Z",
          },
          {
            id: "sub-2",
            email: "client2@example.com",
            created_at: "2024-01-02T10:30:00Z",
          },
        ]),
    });
  }

  // Fallback
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

describe("AdminSubscribers", () => {
  it("renders subscribers from API", async () => {
    render(
      <MemoryRouter>
        <AdminSubscribers />
      </MemoryRouter>
    );

    expect(await screen.findByText("client1@example.com")).toBeTruthy();
    expect(await screen.findByText("client2@example.com")).toBeTruthy();
  });
});
