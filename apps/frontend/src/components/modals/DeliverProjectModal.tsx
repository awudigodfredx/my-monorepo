import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { useModalStepper } from "../../hooks/useModalStepper";
import ModalShell from "./ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  project: string;
  timeline: string;
  budget: string;
}

const DeliverProjectModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(4);
  const [form, setForm] = useState<FormState>({
    project: "",
    timeline: "",
    budget: "",
  });

  // emit analytics event when modal mounts (becomes visible)
  useEffect(() => {
    if (open) {
      console.log(EVENTS.DELIVER_PROJECT_MODAL_OPEN, {
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
    // Step 0 — project description
    <div key="step-0">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        What is your project?
      </label>
      <textarea
        value={form.project}
        onChange={update("project")}
        rows={4}
        placeholder="Describe what you need built..."
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary resize-none"
        data-testid="step-0-project"
      />
    </div>,

    // Step 1 — timeline
    <div key="step-1">
      <label htmlFor="timeline" className="block font-mono text-xs uppercase tracking-widest mb-3">
        What is your timeline?
      </label>
      <select
        id="timeline"
        value={form.timeline}
        onChange={update("timeline")}
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary"
        data-testid="step-1-timeline"
      >
        <option value="">Select timeline...</option>
        <option>Less than 1 month</option>
        <option>1–3 months</option>
        <option>3–6 months</option>
        <option>6+ months</option>
      </select>
    </div>,

    // Step 2 — budget
    <div key="step-2">
      <label htmlFor="budget" className="block font-mono text-xs uppercase tracking-widest mb-3">
        Budget range?
      </label>
      <select
        id="budget"
        value={form.budget}
        onChange={update("budget")}
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary"
        data-testid="step-2-budget"
      >
        <option value="">Select budget...</option>
        <option>Under $500</option>
        <option>$500 – $2,000</option>
        <option>$2,000 – $5,000</option>
        <option>$5,000+</option>
      </select>
    </div>,

    // Step 3 — confirmation
    <div key="step-3" data-testid="step-3-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Thank you
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        I will review your project details and be in touch within 24 hours to
        discuss next steps.
      </p>
      {form.project && (
        <p className="text-xs font-mono text-gray-400 border-l-2 border-brand-primary pl-3">
          {form.project.slice(0, 80)}
          {form.project.length > 80 ? "..." : ""}
        </p>
      )}
    </div>,
  ];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Deliver my project"
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

export default DeliverProjectModal;
