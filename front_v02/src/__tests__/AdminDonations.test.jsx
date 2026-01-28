// src/__tests__/AdminDonations.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import AdminDonations from "../pages/admin/AdminDonations";
import api from "../lib/apiClient";

describe("AdminDonations page", () => {
  it("renders heading and donations from API", async () => {
    // First call: campaigns
    // Second call: donations
    api.get = vi
      .fn()
      .mockResolvedValueOnce([
        { id: "c1", name: "Biogas for Schools" },
      ])
      .mockResolvedValueOnce([
        {
          id: "d1",
          campaign_id: "c1",
          amount: 500000,
          currency: "UGX",
          status: "confirmed",
          payment_method: "mtn_momo",
          donor_name: "Test Donor",
          created_at: "2026-01-20T10:00:00Z",
        },
      ]);

    render(
      <MemoryRouter>
        <AdminDonations />
      </MemoryRouter>
    );

    // Static heading: target the <h1>
    const heading = screen.getByRole("heading", { name: "Donations" });
    expect(heading).toBeInTheDocument();

    // Data from mocked API
    // There are two "Biogas for Schools" (select option + table cell),
    // so use *AllBy* to avoid the multiple-elements error.
    const campaignTexts = await screen.findAllByText("Biogas for Schools");
    expect(campaignTexts.length).toBeGreaterThan(0);

    await screen.findByText(/500,000/);    // formatted amount
    await screen.findByText(/Test Donor/); // donor name
  });
});
