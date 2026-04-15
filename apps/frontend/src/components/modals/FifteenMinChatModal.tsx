import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { useModalStepper } from "../../hooks/useModalStepper";
import ModalShell from "./ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  topic: string;
  time: string;
}

const FifteenMinChatModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(3);
  const [form, setForm] = useState<FormState>({ topic: "", time: "" });

  useEffect(() => {
    if (open) {
      console.log(EVENTS.FIFTEEN_MIN_CHAT_MODAL_OPEN, {
        timestamp: Date.now(),
        source: "help_me_free_cta",
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

  const steps: React.ReactNode[] = [
    // Step 0 — topic
    <div key="step-0">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        What do you need help with?
      </label>
      <textarea
        value={form.topic}
        onChange={update("topic")}
        rows={3}
        placeholder="e.g. career advice, technical question, project review..."
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary resize-none"
        data-testid="step-0-topic"
      />
    </div>,

    // Step 1 — preferred time
    <div key="step-1">
      <label
        htmlFor="time-slot"
        className="block font-mono text-xs uppercase tracking-widest mb-3"
      >
        Preferred time slot?
      </label>
      <select
        id="time-slot"
        value={form.time}
        onChange={update("time")}
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary"
        data-testid="step-1-time"
      >
        <option value="">Select time...</option>
        <option>Weekday morning (8am–12pm)</option>
        <option>Weekday afternoon (12pm–5pm)</option>
        <option>Weekday evening (6pm–9pm)</option>
        <option>Weekend</option>
      </select>
    </div>,

    // Step 2 — confirmation
    <div key="step-2" data-testid="step-2-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Booked
      </p>
      <p className="text-sm text-gray-600 leading-relaxed">
        I will reach out within 24 hours to confirm your 15-minute slot.
      </p>
    </div>,
  ];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="15 min chat"
      step={step}
      totalSteps={3}
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

export default FifteenMinChatModal;
