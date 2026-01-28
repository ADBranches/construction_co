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

// 🔧 Global fetch mock – aligns with how apiClient.js likely works
vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: "test-inquiry-id" }),
      text: () => Promise.resolve(JSON.stringify({ id: "test-inquiry-id" })),
    })
  )
);

function renderWithProviders(ui) {
  const helmetContext = {};
  return render(
    <HelmetProvider context={helmetContext}>{ui}</HelmetProvider>
  );
}

describe("Quote page", () => {
  beforeEach(() => {
    // Clear calls between tests but keep the same mock implementation
    fetch.mockClear();
  });

  it("submits inquiry with source=quote", async () => {
    renderWithProviders(<Quote />);

    // Match actual labels from Quote.jsx
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Test Client" },
    });

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "client@example.com" },
    });

    // Project Type is required in the form
    fireEvent.change(screen.getByLabelText(/Project Type/i), {
      target: { value: "biodigester_installation" },
    });

    fireEvent.change(screen.getByLabelText(/Project Description/i), {
      target: { value: "I need a biogas system." },
    });

    // Button text is "Submit Request" via PrimaryButton
    fireEvent.click(
      screen.getByRole("button", { name: /Submit Request/i })
    );

    // Wait for the API call (via apiClient → fetch)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetch.mock.calls[0];

    // Depending on API_BASE, url may be full; just ensure it targets the right endpoint
    expect(url).toContain("/api/v1/inquiries");

    // apiClient likely sends JSON body
    const body = JSON.parse(options.body);

    // Ensure the payload contains our fields and source=quote
    expect(body.full_name).toBe("Test Client");
    expect(body.email).toBe("client@example.com");
    expect(body.project_type).toBe("biodigester_installation");
    expect(body.message).toBe("I need a biogas system.");
    expect(body.source).toBe("quote");
  });
});
