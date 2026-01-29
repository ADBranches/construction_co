// src/__tests__/Services.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import Services from "../pages/Services.jsx";

// Mock ServicesStore – path must match Services.jsx import
vi.mock("../lib/servicesStore", () => ({
  __esModule: true,
  default: {
    list: vi.fn(),
  },
}));

import ServicesStore from "../lib/servicesStore";

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

// Mock API module
vi.mock("../lib/api", () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
  },
}));

import api from "../lib/api";

describe("Services page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders services from store", async () => {
    ServicesStore.list.mockReturnValueOnce([
      {
        id: "1",
        name: "Biogas Systems",
        slug: "biogas-systems",
        short_description: "Biogas digesters for farms and homes.",
      },
    ]);

    renderWithProviders(<Services />);

    expect(
      screen.getByText("Integrated Farm & Construction Solutions")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Biogas Systems")).toBeInTheDocument();
    });
  });

});
