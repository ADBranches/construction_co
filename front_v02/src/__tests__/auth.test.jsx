// src/__tests__/auth.test.jsx
import { describe, it, expect, vi } from "vitest";
import { login } from "../lib/auth.js";

// Mock the module that auth.js actually uses
vi.mock("../lib/api", () => ({
  __esModule: true,
  apiRequest: vi.fn(),
}));

describe("Auth Role Handling", () => {
  it("stores role & is_superuser after login", async () => {
    const { apiRequest } = await import("../lib/api");

    // 1st call: /api/v1/auth/login
    apiRequest.mockResolvedValueOnce({ access_token: "xyz123" });

    // 2nd call: /api/v1/auth/me
    apiRequest.mockResolvedValueOnce({
      email: "admin@example.com",
      role: "admin",
      is_superuser: false,
    });

    await login("admin@example.com", "adminpass");

    expect(localStorage.getItem("role")).toBe("admin");
    expect(localStorage.getItem("is_superuser")).toBe("0");
  });
});
