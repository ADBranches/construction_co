// src/__tests__/ProjectsAdmin.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminProjects from "../pages/admin/AdminProjects.jsx";

// Mock fetch globally – apiClient uses fetch under the hood
vi.stubGlobal("fetch", (url) => {
  let body;

  if (typeof url === "string" && url.includes("/api/v1/projects")) {
    body = JSON.stringify([
      {
        id: "proj-1",
        name: "Demo Project",
        slug: "demo-project",
        location: "Kampala",
        client_name: "Client X",
        budget: "50M UGX",
        status: "ongoing",
        is_featured: true,
        short_description: "Short demo",
      },
    ]);
  } else {
    // default payload for other endpoints
    body = JSON.stringify({});
  }

  return Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(body),
    json: () => Promise.resolve(JSON.parse(body)),
  });
});

describe("AdminProjects", () => {
  it("renders projects list from API", async () => {
    render(
      <MemoryRouter>
        <AdminProjects />
      </MemoryRouter>
    );

    // Title match is exact
    expect(await screen.findByText("Demo Project")).toBeTruthy();

    // Location text is "Location: Kampala" with spacing/newline,
    // so use a regex/substring matcher instead of exact string
    expect(await screen.findByText(/Kampala/i)).toBeTruthy();
  });
});
