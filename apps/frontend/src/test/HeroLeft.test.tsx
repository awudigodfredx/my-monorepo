import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeroLeft from "../components/HeroLeft";

vi.mock("../config/hero.json", () => ({
  default: {
    heading: "Build systems. Create impact.",
    subheading: "Software, data, strategy, and creative execution.",
    paragraph: "I design practical digital solutions.",
  },
}));

vi.mock("@monorepo/shared", () => ({
  EVENTS: { PAGE_VIEW: "hero_view" },
}));

describe("HeroLeft — Slice 2", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders the heading from config", async () => {
    render(<HeroLeft />);
    const el = await screen.findByTestId("hero-heading");
    expect(el).toHaveTextContent("Build systems. Create impact.");
  });

  it("renders the subheading from config", async () => {
    render(<HeroLeft />);
    const el = await screen.findByTestId("hero-subheading");
    expect(el).toHaveTextContent(
      "Software, data, strategy, and creative execution.",
    );
  });

  it("renders the paragraph from config", async () => {
    render(<HeroLeft />);
    const el = await screen.findByTestId("hero-paragraph");
    expect(el).toHaveTextContent("I design practical digital solutions.");
  });

  it("emits page_view event on mount", async () => {
    render(<HeroLeft />);
    await screen.findByTestId("hero-heading"); // wait for mount + effect
    expect(console.log).toHaveBeenCalledWith(
      "[analytics]",
      expect.objectContaining({
        event: "hero_view",
        page_name: "home",
        timestamp: expect.any(Number),
      }),
    );
  });
});
