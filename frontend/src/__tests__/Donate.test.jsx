// src/__tests__/Donate.test.jsx
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Donate from "../pages/Donate";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";         // ⬅️ NEW

function renderWithRouter() {
  return render(
    <HelmetProvider>                                   {/* ⬅️ wrap with provider */}
        <MemoryRouter initialEntries={["/donate"]}>
        <Routes>
            <Route path="/donate" element={<Donate />} />
        </Routes>
        </MemoryRouter>
    </HelmetProvider>
  );
}

describe("Donate page", () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = vi.spyOn(global, "fetch").mockImplementation((url, options) => {
      // campaigns list
      if (url.toString().includes("/api/v1/campaigns")) {
        return Promise.resolve(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      }

      // donations intent
      if (url.toString().includes("/api/v1/donations")) {
        const body = options?.body ? JSON.parse(options.body) : {};
        const mockResponse = {
          donation: {
            id: "donation-123",
            amount: body.amount,
            currency: body.currency,
            status: "pending",
            donor_email: body.donor_email || null,
          },
          payment_url: "https://payments.example.local/card/checkout/session-123",
          provider_session_id: "session-123",
        };

        return Promise.resolve(
          new Response(JSON.stringify(mockResponse), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          })
        );
      }

      return Promise.reject(new Error("Unexpected fetch in Donate.test"));
    });
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("renders the donate form and validates amount", async () => {
    renderWithRouter();

    // Wait for initial campaigns fetch to settle
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });

    const continueButton = screen.getByRole("button", { name: /continue/i });

    // Try submitting without amount
    fireEvent.click(continueButton);

    expect(
      await screen.findByText(/enter a valid amount greater than zero/i)
    ).toBeInTheDocument();

    // Fill in minimal fields
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: "50000" } });

    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: "Test Donor" } });

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    fireEvent.click(continueButton);

    // We should see the summary step
    expect(
      await screen.findByText(/review your donation/i)
    ).toBeInTheDocument();
  });

  it("calls donation API on confirm", async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });

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

    // On summary screen
    await screen.findByText(/review your donation/i);

    const confirmButton = screen.getByRole("button", {
      name: /confirm & continue to payment/i,
    });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      // Should have made a POST to /donations
      expect(
        fetchSpy.mock.calls.some(([url]) =>
          url.toString().includes("/api/v1/donations")
        )
      ).toBe(true);
    });

    // Success text
    expect(
      await screen.findByText(/your donation has been created/i)
    ).toBeInTheDocument();
  });
});
