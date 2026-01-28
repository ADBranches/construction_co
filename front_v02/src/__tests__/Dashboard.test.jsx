import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

// --- FIXED GLOBAL FETCH MOCK ---
vi.stubGlobal("fetch", () => {
  const mock = {
    services: 3,
    projects: 5,
    inquiries: 10,
    testimonials: 2,
    subscribers: 20,
  };

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mock),
    text: () => Promise.resolve(JSON.stringify(mock)), // required for apiClient.js
  });
});

describe("Admin Dashboard", () => {
  it("renders KPI cards correctly", async () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Match REAL UI labels from your AdminDashboard.jsx
    expect(await screen.findByText("Projects")).toBeTruthy();
    expect(await screen.findByText("5")).toBeTruthy();

    expect(await screen.findByText("Open Inquiries")).toBeTruthy();
    expect(await screen.findByText("10")).toBeTruthy();
  });
});
