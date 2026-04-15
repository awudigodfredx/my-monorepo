import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileCard from "../components/ProfileCard";

// mock profile data
vi.mock("../config/profile.json", () => ({
  default: {
    avatar: "/test-avatar.jpg",
    name: "Godfred Awudi",
    title: "Analyst • Builder • Creative",
    bio: "I work at the intersection of software, data, strategy, and design.",
    funFacts: [
      "Data-driven thinker",
      "System builder",
      "Creative problem solver",
    ],
  },
}));

// mock Framer Motion — renders children without animation in tests
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("ProfileCard — Slice 3", () => {
  it("renders the profile card container", () => {
    render(<ProfileCard />);
    expect(screen.getByTestId("profile-card")).toBeInTheDocument();
  });

  it("renders name from profile.json", () => {
    render(<ProfileCard />);
    expect(screen.getByTestId("profile-name")).toHaveTextContent(
      "Godfred Awudi",
    );
  });

  it("renders title from profile.json", () => {
    render(<ProfileCard />);
    expect(screen.getByTestId("profile-title")).toHaveTextContent(
      "Analyst • Builder • Creative",
    );
  });

  it("renders bio from profile.json", () => {
    render(<ProfileCard />);
    expect(screen.getByTestId("profile-bio")).toBeInTheDocument();
  });

  it("renders all three fun facts", () => {
    render(<ProfileCard />);
    expect(screen.getByTestId("fact-0")).toHaveTextContent(
      "Data-driven thinker",
    );
    expect(screen.getByTestId("fact-1")).toHaveTextContent("System builder");
    expect(screen.getByTestId("fact-2")).toHaveTextContent(
      "Creative problem solver",
    );
  });

  it("shows initials GA when avatar image fails to load", () => {
    render(<ProfileCard />);
    const img = screen.getByTestId("avatar-img");
    fireEvent.error(img); // simulate image load failure
    expect(screen.getByTestId("avatar-initials")).toHaveTextContent("GA");
    expect(screen.queryByTestId("avatar-img")).not.toBeInTheDocument();
  });
});
