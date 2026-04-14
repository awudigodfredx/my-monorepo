import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DeliverProjectModal from "../components/modals/DeliverProjectModal";

vi.mock("@monorepo/shared", () => ({
  EVENTS: { DELIVER_PROJECT_MODAL_OPEN: "deliver_project_modal_open" },
}));

const renderModal = (open = true) => {
  const onClose = vi.fn();
  render(<DeliverProjectModal open={open} onClose={onClose} />);
  return { onClose };
};

describe("DeliverProjectModal — Slice 4A", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders modal shell when open", () => {
    renderModal();
    expect(screen.getByTestId("modal-shell")).toBeInTheDocument();
  });

  it('shows title "Deliver my project"', () => {
    renderModal();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Deliver my project",
    );
  });

  it("shows 4 step progress bars", () => {
    renderModal();
    expect(screen.getByTestId("step-bar-0")).toBeInTheDocument();
    expect(screen.getByTestId("step-bar-3")).toBeInTheDocument();
  });

  it("starts on step 0 — project textarea visible", () => {
    renderModal();
    expect(screen.getByTestId("step-0-project")).toBeInTheDocument();
  });

  it("clicking Next advances to step 1", () => {
    renderModal();
    fireEvent.click(screen.getByTestId("modal-next"));
    expect(screen.getByTestId("step-1-timeline")).toBeInTheDocument();
  });

  it("clicking Back from step 1 returns to step 0", () => {
    renderModal();
    fireEvent.click(screen.getByTestId("modal-next"));
    fireEvent.click(screen.getByTestId("modal-back"));
    expect(screen.getByTestId("step-0-project")).toBeInTheDocument();
  });

  it("reaches step 3 confirmation after 3 Next clicks", () => {
    renderModal();
    fireEvent.click(screen.getByTestId("modal-next")); // → step 1
    fireEvent.click(screen.getByTestId("modal-next")); // → step 2
    fireEvent.click(screen.getByTestId("modal-next")); // → step 3
    expect(screen.getByTestId("step-3-confirmation")).toBeInTheDocument();
    expect(screen.getByTestId("modal-submit")).toBeInTheDocument();
  });

  it("close button calls onClose and resets", () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByTestId("modal-close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("emits deliver_project_modal_open when open becomes true", () => {
    renderModal(true);
    expect(console.log).toHaveBeenCalledWith(
      "deliver_project_modal_open",
      expect.objectContaining({ timestamp: expect.any(Number) }),
    );
  });
});
