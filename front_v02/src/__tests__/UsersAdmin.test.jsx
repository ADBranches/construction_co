// src/__tests__/UsersAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminUsers from "../pages/admin/AdminUsers.jsx";

// Bypass guard
vi.mock("../components/layout/useRequireAdmin.js", () => ({
  useRequireAdmin: () => {},
}));

// Stub fetch used by apiRequest
vi.stubGlobal("fetch", (input, init = {}) => {
  const url = typeof input === "string" ? input : input?.url ?? "";

  // Initial list
  if (url.includes("/api/v1/users") && (!init.method || init.method === "GET")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "u1",
            email: "admin@example.com",
            full_name: "Admin User",
            role: "admin",
            is_active: true,
            is_superuser: true,
          },
          {
            id: "u2",
            email: "staff@example.com",
            full_name: "Staff User",
            role: "staff",
            is_active: true,
            is_superuser: false,
          },
        ]),
    });
  }

  // Role update
  if (url.includes("/api/v1/users/") && init.method === "PATCH") {
    const body = JSON.parse(init.body || "{}");
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "u2",
          email: "staff@example.com",
          full_name: "Staff User",
          role: body.role || "staff",
          is_active: true,
          is_superuser: !!body.is_superuser,
        }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  });
});

describe("AdminUsers", () => {
  it("renders users and allows updating role", async () => {
    render(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );

    // Wait for list to load
    expect(await screen.findByText("admin@example.com")).toBeTruthy();
    expect(await screen.findByText("staff@example.com")).toBeTruthy();

    // Find the staff role select
    const roleSelect = screen.getByDisplayValue("staff");
    fireEvent.change(roleSelect, { target: { value: "admin" } });

    // Click update
    const updateButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(roleSelect.value).toBe("admin");
    });
  });
});
