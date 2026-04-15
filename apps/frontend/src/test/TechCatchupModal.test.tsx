// TechCatchupModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TechCatchupModal from "../components/modals/TechCatchupModal";

vi.mock("@monorepo/shared", () => ({
  EVENTS: { TECH_CATCHUP_MODAL_OPEN: "tech_catchup_modal_open" },
}));

describe("TechCatchupModal — Slice 5C", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders when open", () => {
    render(<TechCatchupModal open onClose={vi.fn()} />);
    expect(screen.getByTestId("modal-shell")).toBeInTheDocument();
  });

  it("shows correct title", () => {
    render(<TechCatchupModal open onClose={vi.fn()} />);
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "1-2-many tech catch up",
    );
  });

  it("reaches confirmation after 2 Next clicks", () => {
    render(<TechCatchupModal open onClose={vi.fn()} />);
    fireEvent.click(screen.getByTestId("modal-next")); // → step 1
    fireEvent.click(screen.getByTestId("modal-next")); // → step 2
    expect(screen.getByTestId("step-2-confirmation")).toBeInTheDocument();
  });

  it("emits tech_catchup_modal_open on open", () => {
    render(<TechCatchupModal open onClose={vi.fn()} />);
    expect(console.log).toHaveBeenCalledWith(
      "tech_catchup_modal_open",
      expect.objectContaining({ timestamp: expect.any(Number) }),
    );
  });
});
