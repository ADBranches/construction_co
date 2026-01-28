// src/__tests__/DashboardDonationsWidget.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardDonationsWidget from "../components/admin/DashboardDonationsWidget";

function renderWidget() {
  return render(
    <MemoryRouter>
      <DashboardDonationsWidget />
    </MemoryRouter>
  );
}

describe("DashboardDonationsWidget", () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation((url) => {
      const u = url.toString();

      if (u.includes("/api/v1/stats/donations/summary")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              month_total: 150000,
              donors_count: 3,
              top_campaign: {
                id: "c1",
                name: "Biogas for Schools",
                total_amount: 150000,
              },
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }
          )
        );
      }

      return Promise.reject(
        new Error(`Unexpected fetch in DashboardDonationsWidget.test: ${u}`)
      );
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("shows donation stats from API", async () => {
    renderWidget();

    // amount
    expect(
      await screen.findByText(/150,000 UGX|150000 UGX/)
    ).toBeInTheDocument();

    // donors
    expect(
      screen.getByText(/Donors this month/i)
    ).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    // top campaign
    expect(
      screen.getByText(/Biogas for Schools/i)
    ).toBeInTheDocument();
  });
});
