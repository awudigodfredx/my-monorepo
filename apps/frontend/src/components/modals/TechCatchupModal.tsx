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
  size: string;
}

const TechCatchupModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(3);
  const [form, setForm] = useState<FormState>({ topic: "", size: "" });

  useEffect(() => {
    if (open) {
      trackEvent(EVENTS.TECH_CATCHUP_MODAL_OPEN, {
        modal_name: "tech_catchup",
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
        Topic or technology?
      </label>
      <textarea
        value={form.topic}
        onChange={update("topic")}
        rows={3}
        placeholder="e.g. React state management, API design, DevSecOps..."
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary resize-none"
        data-testid="step-0-topic"
      />
    </div>,

    // Step 1 — team size
    <div key="step-1">
      <label
        htmlFor="team-size"
        className="block font-mono text-xs uppercase tracking-widest mb-3"
      >
        Team size?
      </label>
      <select
        id="team-size"
        value={form.size}
        onChange={update("size")}
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary"
        data-testid="step-1-size"
      >
        <option value="">Select size...</option>
        <option>Just me</option>
        <option>2–5 people</option>
        <option>6–15 people</option>
        <option>15+ people</option>
      </select>
    </div>,

    // Step 2 — confirmation
    <div key="step-2" data-testid="step-2-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Request received
      </p>
      <p className="text-sm text-gray-600 leading-relaxed">
        I will be in touch within 24 hours to confirm the session format and
        timing.
      </p>
    </div>,
  ];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="1-2-many tech catch up"
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

export default TechCatchupModal;
