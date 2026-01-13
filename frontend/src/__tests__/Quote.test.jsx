// src/__tests__/Quote.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";
import Quote from "../pages/Quote.jsx";

// Mock api client
vi.mock("../lib/apiClient", () => ({
  __esModule: true,
  default: {
    post: vi.fn(),
  },
}));

import api from "../lib/apiClient";

function renderWithProviders(ui) {
  const helmetContext = {};
  return render(
    <HelmetProvider context={helmetContext}>
      {ui}
    </HelmetProvider>
  );
}

describe("Quote page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("submits inquiry with source=quote", async () => {
    // Mock a successful API response
    api.post.mockResolvedValueOnce({
      data: {
        id: "test-inquiry-id",
      },
    });

    renderWithProviders(<Quote />);

    // Match the actual labels from Quote.jsx
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Test Client" },
    });

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "client@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/Project Description/i), {
      target: { value: "I need a biogas system." },
    });

    // Button text is "Submit Request" via PrimaryButton
    fireEvent.click(
      screen.getByRole("button", { name: /Submit Request/i })
    );

    // Wait for the API call
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledTimes(1);
    });

    const [url, payload] = api.post.mock.calls[0];

    // Ensure it's hitting the correct endpoint
    expect(url).toBe("/api/v1/inquiries");

    // Ensure the payload contains our fields and source=quote
    expect(payload.full_name).toBe("Test Client");
    expect(payload.source).toBe("quote");
  });
});
