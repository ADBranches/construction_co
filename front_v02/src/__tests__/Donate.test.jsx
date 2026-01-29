// src/__tests__/Donate.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";
import Donate from "../pages/Donate";

// Mock CampaignsStore
vi.mock("../lib/campaignsStore", () => ({
  __esModule: true,
  default: {
    getActive: () => [
      {
        id: "c1",
        name: "Biogas for Schools",
        slug: "biogas-for-schools",
        status: "active",
        isActive: true,
      },
    ],
    list: () => [],
  },
}));

// Mock DonationsStore
vi.mock("../lib/donationsStore", () => ({
  __esModule: true,
  default: {
    create: (payload) => ({
      id: "donation-123",
      ...payload,
    }),
  },
}));

function renderWithRouter() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/donate"]}>
        <Routes>
          <Route path="/donate" element={<Donate />} />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("Donate page", () => {
  it("renders the donate form and validates amount", async () => {
    renderWithRouter();

    const continueButton = screen.getByRole("button", { name: /continue/i });

    // Submit without amount
    fireEvent.click(continueButton);

    expect(
      await screen.findByText(/enter a valid amount greater than zero/i)
    ).toBeInTheDocument();

    // Fill minimal valid fields
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "50000" },
    });

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Test Donor" },
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(continueButton);

    expect(
      await screen.findByText(/review your donation/i)
    ).toBeInTheDocument();
  });

  it("creates a donation via store on confirm", async () => {
    renderWithRouter();

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "75000" },
    });
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Donor" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "jane@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await screen.findByText(/review your donation/i);

    fireEvent.click(
      screen.getByRole("button", {
        name: /confirm & continue to payment/i,
      })
    );

    expect(
      await screen.findByText(/your donation has been created/i)
    ).toBeInTheDocument();
  });
});
