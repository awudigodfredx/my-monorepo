import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HelpMeFreeCTA from "../components/HelpMeFreeCTA";

vi.mock("../config/ctas.json", () => ({
  default: {
    helpMeFree: {
      label: "Connect With Me",
      options: [
        { id: "chat", label: "15 min chat", modal: "FifteenMinChatModal" },
        { id: "audit", label: "Audit my website", modal: "AuditWebsiteModal" },
        {
          id: "catchup",
          label: "1-2-many tech catch up",
          modal: "TechCatchupModal",
        },
      ],
    },
  },
}));

vi.mock("@monorepo/shared", () => ({
  EVENTS: { HELP_ME_FREE_CTA_CLICK: "cta_connect_click" },
}));

vi.mock("../components/modals/FifteenMinChatModal", () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="chat-modal">ChatModal</div> : null,
}));
vi.mock("../components/modals/AuditWebsiteModal", () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="audit-modal">AuditModal</div> : null,
}));
vi.mock("../components/modals/TechCatchupModal", () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="catchup-modal">CatchupModal</div> : null,
}));

describe("HelpMeFreeCTA — Slice 5", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders the button from config", async () => {
    render(<HelpMeFreeCTA />);
    const btn = await screen.findByTestId("help-me-free-btn");
    expect(btn).toHaveTextContent("Connect With Me");
  });

  it("selector hidden before button click", async () => {
    render(<HelpMeFreeCTA />);
    await screen.findByTestId("help-me-free-btn");
    expect(
      screen.queryByTestId("help-me-free-selector"),
    ).not.toBeInTheDocument();
  });

  it("clicking button opens selector with 3 options", async () => {
    render(<HelpMeFreeCTA />);
    fireEvent.click(await screen.findByTestId("help-me-free-btn"));
    expect(screen.getByTestId("help-me-free-selector")).toBeInTheDocument();
    expect(screen.getByTestId("option-chat")).toBeInTheDocument();
    expect(screen.getByTestId("option-audit")).toBeInTheDocument();
    expect(screen.getByTestId("option-catchup")).toBeInTheDocument();
  });

  it("emits help_me_free_cta_click on button click", async () => {
    render(<HelpMeFreeCTA />);
    fireEvent.click(await screen.findByTestId("help-me-free-btn"));
    expect(console.log).toHaveBeenCalledWith(
      "[analytics]",
      expect.objectContaining({ event: "cta_connect_click", timestamp: expect.any(Number) }),
    );
  });

  it("clicking 15 min chat opens FifteenMinChatModal", async () => {
    render(<HelpMeFreeCTA />);
    fireEvent.click(await screen.findByTestId("help-me-free-btn"));
    fireEvent.click(screen.getByTestId("option-chat"));
    await waitFor(() =>
      expect(screen.getByTestId("chat-modal")).toBeInTheDocument(),
    );
  });

  it("clicking Audit my website opens AuditWebsiteModal", async () => {
    render(<HelpMeFreeCTA />);
    fireEvent.click(await screen.findByTestId("help-me-free-btn"));
    fireEvent.click(screen.getByTestId("option-audit"));
    await waitFor(() =>
      expect(screen.getByTestId("audit-modal")).toBeInTheDocument(),
    );
  });

  it("clicking tech catch up opens TechCatchupModal", async () => {
    render(<HelpMeFreeCTA />);
    fireEvent.click(await screen.findByTestId("help-me-free-btn"));
    fireEvent.click(screen.getByTestId("option-catchup"));
    await waitFor(() =>
      expect(screen.getByTestId("catchup-modal")).toBeInTheDocument(),
    );
  });
});
