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

// Mock InquiriesStore so we don't hit real localStorage
vi.mock("../lib/inquiriesStore", () => ({
  __esModule: true,
  default: {
    create: vi.fn(),
  },
}));

import InquiriesStore from "../lib/inquiriesStore";

function renderWithProviders(ui) {
  const helmetContext = {};
  return render(
    <HelmetProvider context={helmetContext}>{ui}</HelmetProvider>
  );
}

describe("Quote page", () => {
  beforeEach(() => {
    InquiriesStore.create.mockClear();
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

    // Wait for the store call
    await waitFor(() => {
      expect(InquiriesStore.create).toHaveBeenCalledTimes(1);
    });

    const [payload] = InquiriesStore.create.mock.calls[0];

    // Ensure the payload contains our fields and source=quote
    expect(payload.full_name).toBe("Test Client");
    expect(payload.email).toBe("client@example.com");
    expect(payload.project_type).toBe("biodigester_installation");
    expect(payload.message).toBe("I need a biogas system.");
    expect(payload.source).toBe("quote");
  });
});
