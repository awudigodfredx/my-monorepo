import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WorkWithMeCTA from "../components/WorkWithMeCTA";

vi.mock("../config/ctas.json", () => ({
  default: {
    workWithMe: {
      label: "Work with me",
      options: [
        {
          id: "deliver",
          label: "Deliver my project",
          modal: "DeliverProjectModal",
        },
        { id: "mentor", label: "Mentor me", modal: "MentorMeModal" },
        { id: "coffee", label: "Coffee with me", modal: "CoffeeWithMeModal" },
      ],
    },
  },
}));

vi.mock("@monorepo/shared", () => ({
  EVENTS: {
    WORK_WITH_ME_CTA_CLICK: "work_with_me_cta_click",
    DELIVER_PROJECT_MODAL_OPEN: "deliver_project_modal_open",
    MENTOR_ME_MODAL_OPEN: "mentor_me_modal_open",
    COFFEE_WITH_ME_MODAL_OPEN: "coffee_with_me_modal_open",
  },
}));

// mock the lazy-loaded modals so tests don't try to render them
vi.mock("../components/modals/DeliverProjectModal", () => ({
  default: ({ open }: { open: boolean }) => {
    if (open)
      console.log("deliver_project_modal_open", {
        timestamp: Date.now(),
        source: "work_with_me_cta",
      });
    return open ? <div data-testid="deliver-modal">DeliverModal</div> : null;
  },
}));
vi.mock("../components/modals/MentorMeModal", () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="mentor-modal">MentorModal</div> : null,
}));
vi.mock("../components/modals/CoffeeWithMeModal", () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div data-testid="coffee-modal">CoffeeModal</div> : null,
}));

describe("WorkWithMeCTA — Slice 4", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("renders the button from config", async () => {
    render(<WorkWithMeCTA />);
    const btn = await screen.findByTestId("work-with-me-btn");
    expect(btn).toHaveTextContent("Work with me");
  });

  it("selector is hidden before button click", async () => {
    render(<WorkWithMeCTA />);
    await screen.findByTestId("work-with-me-btn");
    expect(
      screen.queryByTestId("work-with-me-selector"),
    ).not.toBeInTheDocument();
  });

  it("clicking button opens selector with 3 options", async () => {
    render(<WorkWithMeCTA />);
    fireEvent.click(await screen.findByTestId("work-with-me-btn"));
    expect(screen.getByTestId("work-with-me-selector")).toBeInTheDocument();
    expect(screen.getByTestId("option-deliver")).toBeInTheDocument();
    expect(screen.getByTestId("option-mentor")).toBeInTheDocument();
    expect(screen.getByTestId("option-coffee")).toBeInTheDocument();
  });

  it("emits work_with_me_cta_click on button click", async () => {
    render(<WorkWithMeCTA />);
    fireEvent.click(await screen.findByTestId("work-with-me-btn"));
    expect(console.log).toHaveBeenCalledWith(
      "work_with_me_cta_click",
      expect.objectContaining({ timestamp: expect.any(Number) }),
    );
  });

  it("clicking Deliver my project opens DeliverProjectModal", async () => {
    render(<WorkWithMeCTA />);
    fireEvent.click(await screen.findByTestId("work-with-me-btn"));
    fireEvent.click(screen.getByTestId("option-deliver"));
    await waitFor(() =>
      expect(screen.getByTestId("deliver-modal")).toBeInTheDocument(),
    );
  });

  it("clicking Mentor me opens MentorMeModal", async () => {
    render(<WorkWithMeCTA />);
    fireEvent.click(await screen.findByTestId("work-with-me-btn"));
    fireEvent.click(screen.getByTestId("option-mentor"));
    await waitFor(() =>
      expect(screen.getByTestId("mentor-modal")).toBeInTheDocument(),
    );
  });

  it("clicking Coffee with me opens CoffeeWithMeModal", async () => {
    render(<WorkWithMeCTA />);
    fireEvent.click(await screen.findByTestId("work-with-me-btn"));
    fireEvent.click(screen.getByTestId("option-coffee"));
    await waitFor(() =>
      expect(screen.getByTestId("coffee-modal")).toBeInTheDocument(),
    );
  });

  it("emits deliver_project_modal_open when deliver option clicked", async () => {
    render(<WorkWithMeCTA />);
    fireEvent.click(await screen.findByTestId("work-with-me-btn"));
    fireEvent.click(screen.getByTestId("option-deliver"));
    expect(console.log).toHaveBeenCalledWith(
      "deliver_project_modal_open",
      expect.objectContaining({ timestamp: expect.any(Number) }),
    );
  });

  it("clicking button again toggles selector closed", async () => {
    render(<WorkWithMeCTA />);
    const btn = await screen.findByTestId("work-with-me-btn");
    fireEvent.click(btn); // open
    fireEvent.click(btn); // close
    expect(
      screen.queryByTestId("work-with-me-selector"),
    ).not.toBeInTheDocument();
  });
});
