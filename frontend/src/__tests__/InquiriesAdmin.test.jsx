// src/__tests__/InquiriesAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminInquiries from "../pages/admin/AdminInquiries.jsx";

// Bypass the admin guard in tests
vi.mock("../components/layout/useRequireAdmin.js", () => ({
  useRequireAdmin: () => {},
}));

// Stub fetch used by apiClient
vi.stubGlobal("fetch", (url) => {
  const href = typeof url === "string" ? url : url?.url ?? "";

  if (href.includes("/api/v1/inquiries")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "inq-1",
            full_name: "Client One",
            email: "client1@example.com",
            phone: "+256 700 000000",
            source: "quote",
            status: "new",
            message: "I need a biogas system.",
            internal_notes: "",
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

describe("AdminInquiries", () => {
  it("renders inquiries table with data from API", async () => {
    render(
      <MemoryRouter>
        <AdminInquiries />
      </MemoryRouter>
    );

    expect(await screen.findByText("Client One")).toBeTruthy();
    expect(
      await screen.findByText("client1@example.com")
    ).toBeTruthy();
    expect(
      await screen.findByText("I need a biogas system.")
    ).toBeTruthy();
  });
});

