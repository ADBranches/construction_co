// src/__tests__/AdminDonations.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import * as AdminGuard from "../components/layout/useRequireAdmin";
import CampaignsStore from "../lib/campaignsStore";
import DonationsStore from "../lib/donationsStore";
import AdminDonations from "../pages/admin/AdminDonations.jsx";

describe("AdminDonations page", () => {
  it("renders heading and donations from store", async () => {
    // Bypass admin guard
    vi.spyOn(AdminGuard, "useRequireAdmin").mockImplementation(() => {});

    // CampaignsStore fakes
    vi.spyOn(CampaignsStore, "list").mockReturnValue([
      { id: "c1", name: "Biogas for Schools" },
    ]);

    if (typeof CampaignsStore.getById === "function") {
      vi.spyOn(CampaignsStore, "getById").mockImplementation((id) =>
        id === "c1" ? { id: "c1", name: "Biogas for Schools" } : null
      );
    }

    // DonationsStore fakes
    if (typeof DonationsStore.filterDonations === "function") {
      vi.spyOn(DonationsStore, "filterDonations").mockReturnValue([
        {
          id: "d1",
          campaign_id: "c1",
          amount: 500000,
          currency: "UGX",
          status: "confirmed",
          payment_method: "mtn_momo",
          donor_name: "Test Donor",
          createdAt: "2026-01-20T10:00:00Z",
        },
      ]);
    } else if (typeof DonationsStore.list === "function") {
      // fallback if implementation uses list()
      vi.spyOn(DonationsStore, "list").mockReturnValue([
        {
          id: "d1",
          campaign_id: "c1",
          amount: 500000,
          currency: "UGX",
          status: "confirmed",
          payment_method: "mtn_momo",
          donor_name: "Test Donor",
          createdAt: "2026-01-20T10:00:00Z",
        },
      ]);
    }

    render(
      <MemoryRouter>
        <AdminDonations />
      </MemoryRouter>
    );

    const heading = screen.getByRole("heading", { name: "Donations" });
    expect(heading).toBeInTheDocument();

    const campaignTexts = await screen.findAllByText("Biogas for Schools");
    expect(campaignTexts.length).toBeGreaterThan(0);

    // Amount & donor name should show somewhere in the table
    expect(await screen.findByText(/500,000/)).toBeInTheDocument();
    expect(await screen.findByText(/Test Donor/)).toBeInTheDocument();
  });
});
