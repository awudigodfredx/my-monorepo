// apps/frontend/src/__tests__/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Footer from "../components/Footer";

vi.mock("../config/site.json", () => ({
  default: {
    name: "Godfred Awudi",
    year: 2026,
    tagline: "Build systems. Create impact.",
  },
}));

describe("Footer — Slice 20", () => {
  it("renders the footer", async () => {
    render(<Footer />);
    expect(await screen.findByTestId("footer")).toBeInTheDocument();
  });

  it("renders copyright with correct year and name", async () => {
    render(<Footer />);
    const copyright = await screen.findByTestId("footer-copyright");
    expect(copyright).toHaveTextContent("© 2026 Godfred Awudi");
    expect(copyright).toHaveTextContent("All rights reserved.");
  });

  it("renders tagline from config", async () => {
    render(<Footer />);
    const tagline = await screen.findByTestId("footer-tagline");
    expect(tagline).toHaveTextContent("Build systems. Create impact.");
  });
});
