import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HeroRight from "../components/HeroRight";

vi.mock("../config/profile.json", () => ({
  default: {
    avatar: "/test-avatar.jpg",
    name: "Godfred Awudi",
    title: "Analyst • Builder • Creative",
    funFacts: ["Data-driven thinker"],
  },
}));

vi.mock("@monorepo/shared", () => ({
  EVENTS: { HERO_PROFILE_CARD_VIEW: "hero_profile_card_view" },
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("HeroRight — Slice 3 analytics", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("emits hero_profile_card_view on mount", async () => {
    render(<HeroRight />);
    await screen.findByTestId("profile-card");
    expect(console.log).toHaveBeenCalledWith(
      "[analytics]",
      expect.objectContaining({ event: "hero_profile_card_view", timestamp: expect.any(Number) }),
    );
  });
});
