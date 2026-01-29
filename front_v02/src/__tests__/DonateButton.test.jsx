// src/__tests__/DonateButton.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";

import DonateButton from "../components/donations/DonateButton";
import Donate from "../pages/Donate";

// Mocks so Donate uses stores instead of API
vi.mock("../lib/campaignsStore", () => ({
  __esModule: true,
  default: {
    // Donate page will call these – we give safe defaults
    getActive: () => [],
    list: () => [],
  },
}));

vi.mock("../lib/donationsStore", () => ({
  __esModule: true,
  default: {
    // Simulate a successful donation creation
    create: (payload) => ({ id: "donation-123", ...payload }),
  },
}));

describe("DonateButton", () => {
  it("navigates to /donate when clicked", () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route
              path="/"
              element={<DonateButton label="Donate Now" />}
            />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const btn = screen.getByRole("button", { name: /donate now/i });
    fireEvent.click(btn);

    expect(
      screen.getByText(/support brisk farm solutions/i)
    ).toBeInTheDocument();
  });
});
