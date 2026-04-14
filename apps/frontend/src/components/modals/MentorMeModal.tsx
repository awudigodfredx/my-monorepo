import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { useModalStepper } from "../../hooks/useModalStepper";
import ModalShell from "./ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  goal: string;
  level: string;
  format: string;
}

const MentorMeModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(4);
  const [form, setForm] = useState<FormState>({
    goal: "",
    level: "",
    format: "",
  });

  // emit analytics event when modal mounts (becomes visible)
  useEffect(() => {
    if (open) {
      console.log(EVENTS.MENTOR_ME_MODAL_OPEN, {
        timestamp: Date.now(),
        source: "work_with_me_cta",
      });
    }
  }, [open]);

  const handleClose = () => {
    reset();
    onClose();
  };
  const update =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // ── steps array ─────────────────────────────────────
  const steps: React.ReactNode[] = [
    // Step 0 — learning goal
    <div key="step-0">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        What do you want to learn?
      </label>
      <textarea
        value={form.goal}
        onChange={update("goal")}
        rows={3}
        placeholder="Describe your learning goal..."
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary resize-none"
        data-testid="step-0-goal"
      />
    </div>,

    // Step 1 — experience level
    <div key="step-1">
      <label
        htmlFor="level-select"
        className="block font-mono text-xs uppercase tracking-widest mb-3"
      >
        Your experience level?
      </label>
      <select
        id="level-select"
        value={form.level}
        onChange={update("level")}
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary"
        data-testid="step-1-level"
      >
        <option value="">Select level...</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
    </div>,

    // Step 2 — session format
    <div key="step-2">
      <label
        htmlFor="format-select"
        className="block font-mono text-xs uppercase tracking-widest mb-3"
      >
        Preferred session format?
      </label>
      <select
        id="format-select"
        value={form.format}
        onChange={update("format")}
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary"
        data-testid="step-2-format"
      >
        <option value="">Select format...</option>
        <option>1-on-1 video call</option>
        <option>Async review and feedback</option>
        <option>Ongoing weekly sessions</option>
      </select>
    </div>,

    // Step 3 — confirmation
    <div key="step-3" data-testid="step-3-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Got it
      </p>
      <p className="text-sm text-gray-600 leading-relaxed">
        I will review your goals and be in touch within 24 hours to set up our
        first session.
      </p>
    </div>,
  ];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Mentor me"
      step={step}
      totalSteps={4}
      isFirst={isFirst}
      isLast={isLast}
      onBack={back}
      onNext={next}
      onSubmit={handleClose}
    >
      {steps[step]}
    </ModalShell>
  );
};

export default MentorMeModal;
