import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NavBar from "../components/NavBar";

// mock the dynamic JSON import
vi.mock("../config/nav.json", () => ({
  default: {
    logoSrc: "/test-logo.png",
    logoAlt: "Test Logo",
    logoRoute: "/",
  },
}));

// mock shared events
vi.mock("@monorepo/shared", () => ({
  EVENTS: { NAV_LOGO_CLICK: "nav_logo_click" },
}));

describe("NavBar — Slice 1", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders the logo image", async () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    const logo = await screen.findByTestId("nav-logo");
    expect(logo).toBeInTheDocument();
  });

  it("logo image has correct src from config", async () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    const logo = await screen.findByTestId("nav-logo");
    expect(logo).toHaveAttribute("src", "/test-logo.png");
  });

  it("logo image has correct alt text from config", async () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    const logo = await screen.findByTestId("nav-logo");
    expect(logo).toHaveAttribute("alt", "Test Logo");
  });

  it("logo link navigates to logoRoute", async () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    const link = await screen.findByTestId("nav-logo-link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("emits nav_logo_click event when logo link is clicked", async () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );
    const link = await screen.findByTestId("nav-logo-link");
    fireEvent.click(link);
    expect(console.log).toHaveBeenCalledWith(
      "nav_logo_click",
      expect.objectContaining({
        page: expect.any(String),
        timestamp: expect.any(Number),
      }),
    );
  });
});
