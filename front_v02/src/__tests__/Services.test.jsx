// src/__tests__/Services.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import Services from "../pages/Services.jsx";

// Mock api client – path must match Services.jsx import ("../lib/apiClient")
vi.mock("../lib/apiClient", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

import api from "../lib/apiClient";

function renderWithProviders(ui) {
  const helmetContext = {};
  return render(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("Services page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders services from API", async () => {
    api.get.mockResolvedValueOnce([
      {
        id: "1",
        name: "Biogas Systems",
        slug: "biogas-systems",
        short_description: "Biogas digesters for farms and homes.",
      },
    ]);

    renderWithProviders(<Services />);

    // Assert on a unique, static bit of text from the hero/intro
    expect(
      screen.getByText("Integrated Farm & Construction Solutions")
    ).toBeInTheDocument();

    // Wait for API-loaded service to appear
    await waitFor(() => {
      expect(screen.getByText("Biogas Systems")).toBeInTheDocument();
    });
  });
});
