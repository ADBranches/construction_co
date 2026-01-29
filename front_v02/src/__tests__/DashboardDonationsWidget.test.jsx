// src/__tests__/DashboardDonationsWidget.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import DashboardDonationsWidget from "../components/admin/DashboardDonationsWidget.jsx";
import DonationsStore from "../lib/donationsStore";
import CampaignsStore from "../lib/campaignsStore";

function renderWidget() {
  return render(
    <MemoryRouter>
      <DashboardDonationsWidget />
    </MemoryRouter>
  );
}

describe("DashboardDonationsWidget", () => {
  it("shows donation stats from store", async () => {
    // Make 'now' be Jan 20, 2026 so "this month" math is deterministic
    const dateSpy = vi
      .spyOn(Date, "now")
      .mockReturnValue(new Date("2026-01-20T12:00:00Z").getTime());

    // 2 confirmed donations this month + 1 pending
    vi.spyOn(DonationsStore, "list").mockReturnValue([
      {
        id: "d1",
        campaign_id: "c1",
        amount: 100000,
        currency: "UGX",
        status: "confirmed",
        donor_email: "a@example.com",
        createdAt: "2026-01-10T10:00:00Z",
      },
      {
        id: "d2",
        campaign_id: "c1",
        amount: 50000,
        currency: "UGX",
        status: "confirmed",
        donor_email: "b@example.com",
        createdAt: "2026-01-15T10:00:00Z",
      },
      {
        id: "d3",
        campaign_id: "c1",
        amount: 99999,
        currency: "UGX",
        status: "pending",
        donor_email: "c@example.com",
        createdAt: "2026-01-20T10:00:00Z",
      },
    ]);

    // Top campaign lookup
    if (typeof CampaignsStore.getById === "function") {
      vi.spyOn(CampaignsStore, "getById").mockImplementation((id) =>
        id === "c1" ? { id: "c1", name: "Biogas for Schools" } : null
      );
    }

    renderWidget();

    // Widget title / label
    expect(
      await screen.findByText(/Donations this month/i)
    ).toBeInTheDocument();

    // Donors this month = 2 (two confirmed)
    expect(screen.getByText(/Donors this month/i)).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    // Top campaign name appears
    expect(
      screen.getByText(/Biogas for Schools/i)
    ).toBeInTheDocument();

    // Total confirmed this month = 150,000 UGX
    // Be flexible about formatting (150,000 / 150000 / "UGX 150,000" etc.)
    expect(
      screen.getByText((content) =>
        content.replace(/,/g, "").includes("150000")
      )
    ).toBeTruthy();

    // Clean up Date.now spy
    dateSpy.mockRestore();
  });
});
