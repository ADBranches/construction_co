// src/__tests__/AdminCampaigns.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AdminCampaigns from "../pages/admin/AdminCampaigns";
import api from "../lib/apiClient";

describe("AdminCampaigns page", () => {
  it("renders heading and campaigns from API", async () => {
    // Mock API to return a single campaign
    api.get = vi.fn().mockResolvedValueOnce([
      {
        id: "c1",
        name: "Biogas for Schools",
        slug: "biogas-for-schools",
        target_amount: 100000000,
        raised_amount: 25000000,
        status: "active",
      },
    ]);

    render(
      <MemoryRouter>
        <AdminCampaigns />
      </MemoryRouter>
    );

    // Static heading
    expect(
      screen.getByText(/Donation Campaigns/i)
    ).toBeInTheDocument();

    // Campaign row from mocked API should appear
    await screen.findByText("Biogas for Schools");
  });
});
