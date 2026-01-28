// src/__tests__/DonateButton.test.jsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";         // ⬅️ NEW
import DonateButton from "../components/donations/DonateButton";
import Donate from "../pages/Donate";

describe("DonateButton", () => {
  it("navigates to /donate when clicked", () => {
    render(
      <HelmetProvider>                                   {/* ⬅️ wrap everything */}
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
