// src/__tests__/InquiriesAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// IMPORTANT: import the *real* modules so we can spy on them
import * as AdminGuard from "../components/layout/useRequireAdmin";
import InquiriesStore from "../lib/inquiriesStore";
import AdminInquiries from "../pages/admin/AdminInquiries.jsx";

describe("AdminInquiries", () => {
  it("renders inquiries table with data from store", async () => {
    // 1) Neutralize the admin guard (no redirect / side effects)
    vi.spyOn(AdminGuard, "useRequireAdmin").mockImplementation(() => {});

    // 2) Fake store data
    const fakeItems = [
      {
        id: "inq-1",
        full_name: "Client One",
        name: "Client One", // in case the table uses `name`
        email: "client1@example.com",
        phone: "+256 700 000000",
        source: "quote",
        status: "new",
        message: "I need a biogas system.",
        internal_notes: "",
        created_at: "2024-01-01T00:00:00Z",
      },
    ];

    // 3) Spy on InquiriesStore.list so AdminInquiries sees our fake data
    vi.spyOn(InquiriesStore, "list").mockReturnValue(fakeItems);

    // (Optional) stub updateStatus to avoid errors if called
    if (typeof InquiriesStore.updateStatus === "function") {
      vi.spyOn(InquiriesStore, "updateStatus").mockImplementation(() => {});
    }

    // 4) Render
    render(
      <MemoryRouter>
        <AdminInquiries />
      </MemoryRouter>
    );

    // 5) Assert UI
    expect(await screen.findByText("Client One")).toBeTruthy();
    expect(
      await screen.findByText("client1@example.com")
    ).toBeTruthy();
    expect(
      await screen.findByText("I need a biogas system.")
    ).toBeTruthy();
  });
});
