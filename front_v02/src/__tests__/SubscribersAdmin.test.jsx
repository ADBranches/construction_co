// src/__tests__/SubscribersAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

// Import the real modules so we can spy on them
import * as AdminGuard from "../components/layout/useRequireAdmin";
import SubscribersStore from "../lib/subscribersStore";
import AdminSubscribers from "../pages/admin/AdminSubscribers.jsx";

describe("AdminSubscribers", () => {
  it("renders subscribers from store", async () => {
    // 1) Neutralize the admin guard (no redirect or side-effects)
    vi.spyOn(AdminGuard, "useRequireAdmin").mockImplementation(() => {});

    // 2) Fake subscribers data
    const fakeSubscribers = [
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
    ];

    // 3) Make SubscribersStore.list() return our fake data
    vi.spyOn(SubscribersStore, "list").mockReturnValue(fakeSubscribers);

    // Optional: stub removeById / add / reset so they don't do anything during test
    if (typeof SubscribersStore.removeById === "function") {
      vi.spyOn(SubscribersStore, "removeById").mockImplementation(() => {});
    }
    if (typeof SubscribersStore.add === "function") {
      vi.spyOn(SubscribersStore, "add").mockImplementation(() => {});
    }
    if (typeof SubscribersStore.reset === "function") {
      vi.spyOn(SubscribersStore, "reset").mockImplementation(() => {});
    }

    // 4) Render the page
    render(
      <MemoryRouter>
        <AdminSubscribers />
      </MemoryRouter>
    );

    // 5) Assert that our fake subscribers appear in the table
    expect(await screen.findByText("client1@example.com")).toBeTruthy();
    expect(await screen.findByText("client2@example.com")).toBeTruthy();
  });
});
