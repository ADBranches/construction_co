// src/__tests__/Services.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";
import { act } from "react";
import Services from "../pages/Services.jsx";

// Mock api client
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
      {ui}
    </HelmetProvider>
  );
}

describe("Services page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
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

    // Wrap initial render in act to avoid React's warning
    await act(async () => {
      renderWithProviders(<Services />);
    });

    // Assert on a unique, static bit of text instead of /Services/i
    expect(
      screen.getByText("Integrated Farm & Construction Solutions")
    ).toBeInTheDocument();

    // Wait for API-loaded service to appear
    await waitFor(() => {
      expect(screen.getByText("Biogas Systems")).toBeInTheDocument();
    });

    // Optional: if your component hides the loading message once data arrives:
    // await waitFor(() => {
    //   expect(
    //     screen.queryByText(/Loading services.../i)
    //   ).not.toBeInTheDocument();
    // });
  });
});
