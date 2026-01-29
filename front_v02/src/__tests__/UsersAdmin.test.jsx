// src/__tests__/UsersAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import AdminUsers from "../pages/admin/AdminUsers.jsx";
import UsersStore from "../lib/usersStore.js";

// Bypass guard so the page renders in tests
vi.mock("../components/layout/useRequireAdmin.js", () => ({
  useRequireAdmin: () => {},
}));

describe("AdminUsers", () => {
  it("renders users and allows updating role", async () => {
    // Our fake in-memory users
    const users = [
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
    ];

    // When AdminUsers calls UsersStore.list(), return our fake users
    const listSpy = vi.spyOn(UsersStore, "list").mockReturnValue(users);

    // When AdminUsers calls UsersStore.updateRole, mutate our local array
    const updateRoleSpy = vi
      .spyOn(UsersStore, "updateRole")
      .mockImplementation((id, role) => {
        const idx = users.findIndex((u) => u.id === id);
        if (idx === -1) return null;

        const updated = { ...users[idx], role };
        users[idx] = updated;
        return updated;
      });

    render(
      <MemoryRouter>
        <AdminUsers />
      </MemoryRouter>
    );

    // ✅ Users from store are rendered
    expect(await screen.findByText("admin@example.com")).toBeInTheDocument();
    expect(await screen.findByText("staff@example.com")).toBeInTheDocument();

    // Find the select for the staff user (current value "staff")
    const roleSelect = screen.getByDisplayValue("staff");
    fireEvent.change(roleSelect, { target: { value: "admin" } });

    // Click the "Update" button in that row
    const updateButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(updateButton);

    // UI reflects updated role after store call
    await waitFor(() => {
      expect(roleSelect.value).toBe("admin");
    });

    // Optional sanity checks
    expect(listSpy).toHaveBeenCalled();
    expect(updateRoleSpy).toHaveBeenCalledWith("u2", "admin");
  });
});

