// FifteenMinChatModal.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FifteenMinChatModal from "../components/modals/FifteenMinChatModal";

vi.mock("@monorepo/shared", () => ({
  EVENTS: { FIFTEEN_MIN_CHAT_MODAL_OPEN: "fifteen_min_chat_modal_open" },
}));

describe("FifteenMinChatModal — Slice 5A", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders when open", () => {
    render(<FifteenMinChatModal open onClose={vi.fn()} />);
    expect(screen.getByTestId("modal-shell")).toBeInTheDocument();
  });

  it("shows correct title", () => {
    render(<FifteenMinChatModal open onClose={vi.fn()} />);
    expect(screen.getByTestId("modal-title")).toHaveTextContent("15 min chat");
  });

  it("reaches confirmation after 4 Next clicks", () => {
    render(<FifteenMinChatModal open onClose={vi.fn()} />);
    fireEvent.click(screen.getByTestId("modal-next")); // → step 1
    fireEvent.click(screen.getByTestId("modal-next")); // → step 2
    
    // Step 2 is name — required
    fireEvent.change(screen.getByTestId("step-2-name"), { target: { value: "John Doe" } });
    fireEvent.click(screen.getByTestId("modal-next")); // → step 3
    
    // Step 3 is email — required + valid format
    fireEvent.change(screen.getByTestId("step-3-email"), { target: { value: "john@example.com" } });
    fireEvent.click(screen.getByTestId("modal-next")); // → step 4
    
    expect(screen.getByTestId("step-4-confirmation")).toBeInTheDocument();
  });

  it("emits fifteen_min_chat_modal_open on open", () => {
    render(<FifteenMinChatModal open onClose={vi.fn()} />);
    expect(console.log).toHaveBeenCalledWith(
      "[analytics]",
      expect.objectContaining({ event: "fifteen_min_chat_modal_open", timestamp: expect.any(Number) }),
    );
  });
});
