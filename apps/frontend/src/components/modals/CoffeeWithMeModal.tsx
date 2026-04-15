import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { useModalStepper } from "../../hooks/useModalStepper";
import ModalShell from "./ModalShell";
import { trackEvent } from "../../utils/analytics";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  topic: string;
  time: string;
}

const CoffeeWithMeModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(3);
  const [form, setForm] = useState<FormState>({
    topic: "",
    time: "",
  });

  // emit analytics event when modal mounts (becomes visible)
  useEffect(() => {
    if (open) {
      trackEvent(EVENTS.COFFEE_WITH_ME_MODAL_OPEN, {
        modal_name: "coffee_with_me",
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
    // Step 0 — topic
    <div key="step-0">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        What would you like to talk about?
      </label>
      <textarea
        value={form.topic}
        onChange={update("topic")}
        rows={3}
        placeholder="e.g. career advice, project idea, feedback on my work..."
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary resize-none"
        data-testid="step-0-topic"
      />
    </div>,

    // Step 1 — preferred time
    <div key="step-1">
      <label
        htmlFor="preferred-time"
        className="block font-mono text-xs uppercase tracking-widest mb-3"
      >
        Preferred time?
      </label>
      <select
        id="preferred-time"
        value={form.time}
        onChange={update("time")}
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary"
        data-testid="step-1-time"
      >
        <option value="">Select time...</option>
        <option>Weekday morning</option>
        <option>Weekday evening</option>
        <option>Weekend</option>
      </select>
    </div>,

    // Step 2 — confirmation
    <div key="step-2" data-testid="step-2-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Coffee booked
      </p>
      <p className="text-sm text-gray-600 leading-relaxed">
        Looking forward to our chat. I will reach out to confirm a time that
        works for both of us.
      </p>
    </div>,
  ];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Coffee with me"
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

export default CoffeeWithMeModal;
