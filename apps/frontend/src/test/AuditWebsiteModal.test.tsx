import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AuditWebsiteModal from "../components/modals/AuditWebsiteModal";

vi.mock("@monorepo/shared", () => ({
  EVENTS: { AUDIT_WEBSITE_MODAL_OPEN: "audit_website_modal_open" },
}));

const renderModal = () => {
  const onClose = vi.fn();
  render(<AuditWebsiteModal open onClose={onClose} />);
  return { onClose };
};

describe("AuditWebsiteModal — Slice 5B", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders modal shell when open", () => {
    renderModal();
    expect(screen.getByTestId("modal-shell")).toBeInTheDocument();
  });

  it("shows title Audit my website", () => {
    renderModal();
    expect(screen.getByTestId("modal-title")).toHaveTextContent(
      "Audit my website",
    );
  });

  it("Next is disabled when URL field is empty", () => {
    renderModal();
    expect(screen.getByTestId("modal-next")).toBeDisabled();
  });

  it("Next is disabled when URL is invalid", () => {
    renderModal();
    fireEvent.change(screen.getByTestId("step-0-url"), {
      target: { value: "not-a-url" },
    });
    expect(screen.getByTestId("modal-next")).toBeDisabled();
  });

  it("shows error message when URL is invalid", () => {
    renderModal();
    fireEvent.change(screen.getByTestId("step-0-url"), {
      target: { value: "bad-url" },
    });
    expect(screen.getByTestId("url-error")).toBeInTheDocument();
  });

  it("Next is enabled when URL is valid", () => {
    renderModal();
    fireEvent.change(screen.getByTestId("step-0-url"), {
      target: { value: "https://mysite.com" },
    });
    expect(screen.getByTestId("modal-next")).not.toBeDisabled();
  });

  it("advances to step 1 after valid URL and Next click", () => {
    renderModal();
    fireEvent.change(screen.getByTestId("step-0-url"), {
      target: { value: "https://mysite.com" },
    });
    fireEvent.click(screen.getByTestId("modal-next"));
    expect(screen.getByTestId("step-1-pain")).toBeInTheDocument();
  });

  it("reaches confirmation after completing all steps", () => {
    renderModal();
    fireEvent.change(screen.getByTestId("step-0-url"), {
      target: { value: "https://mysite.com" },
    });
    fireEvent.click(screen.getByTestId("modal-next")); // → step 1
    fireEvent.click(screen.getByTestId("modal-next")); // → step 2
    expect(screen.getByTestId("step-2-confirmation")).toBeInTheDocument();
  });

  it("emits audit_website_modal_open on open", () => {
    renderModal();
    expect(console.log).toHaveBeenCalledWith(
      "audit_website_modal_open",
      expect.objectContaining({ timestamp: expect.any(Number) }),
    );
  });
});
