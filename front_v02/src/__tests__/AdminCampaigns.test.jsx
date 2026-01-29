// src/__tests__/AdminCampaigns.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as AdminGuard from "../components/layout/useRequireAdmin";
import CampaignsStore from "../lib/campaignsStore";
import DonationsStore from "../lib/donationsStore";
import AdminCampaigns from "../pages/admin/AdminCampaigns.jsx";

describe("AdminCampaigns page", () => {
  it("renders heading and campaigns from store", async () => {
    // Bypass admin guard
    vi.spyOn(AdminGuard, "useRequireAdmin").mockImplementation(() => {});

    // Fake campaigns
    vi.spyOn(CampaignsStore, "list").mockReturnValue([
      {
        id: "c1",
        name: "Biogas for Schools",
        slug: "biogas-for-schools",
        target_amount: 100000000,
        status: "active",
      },
    ]);

    // Fake donations per campaign (used for raised amount)
    if (typeof DonationsStore.listByCampaign === "function") {
      vi.spyOn(DonationsStore, "listByCampaign").mockReturnValue([
        {
          id: "d1",
          campaign_id: "c1",
          amount: 25000000,
          status: "confirmed",
        },
      ]);
    }

    render(
      <MemoryRouter>
        <AdminCampaigns />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Donation Campaigns/i)
    ).toBeInTheDocument();

    expect(await screen.findByText("Biogas for Schools")).toBeTruthy();
  });
});
