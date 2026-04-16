import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { useModalStepper } from "../../hooks/useModalStepper";
import ModalShell from "./ModalShell";
import { trackEvent } from "../../utils/analytics";
import { API_BASE } from "../../config/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  project: string;
  timeline: string;
  budget: string;
  name: string;
  email: string;
}

const DeliverProjectModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(5);
  const [form, setForm] = useState<FormState>({
    project: "",
    timeline: "",
    budget: "",
    name: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // emit analytics event when modal mounts (becomes visible)
  useEffect(() => {
    if (open) {
      trackEvent(EVENTS.DELIVER_PROJECT_MODAL_OPEN, {
        modal_name: "deliver_project",
        source: "work_with_me_cta",
      });
    }
  }, [open]);

  const handleClose = () => {
    reset();
    setSubmitting(false);
    setSubmitError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/hero/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.project,
          source: "deliver_project",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackEvent(EVENTS.REQUEST_SUCCESS, { source: "deliver_project" });
      handleClose();
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const nextHandler =
    step === 3 && (!form.name.trim() || !emailValid) ? undefined : next;

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
      <label
        htmlFor="timeline"
        className="block font-mono text-xs uppercase tracking-widest mb-3"
      >
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
      <label
        htmlFor="budget"
        className="block font-mono text-xs uppercase tracking-widest mb-3"
      >
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

    // Step 3 — contact details
    <div key="step-3">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="lead-name"
            className="block font-mono text-xs uppercase tracking-widest mb-2"
          >
            Your name
          </label>
          <input
            id="lead-name"
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="Full name"
            className="w-full border border-gray-200 p-3 text-sm font-mono
                       focus:outline-none focus:border-brand-primary"
            data-testid="step-3-name"
          />
        </div>
        <div>
          <label
            htmlFor="lead-email"
            className="block font-mono text-xs uppercase tracking-widest mb-2"
          >
            Email address
          </label>
          <input
            id="lead-email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            className="w-full border border-gray-200 p-3 text-sm font-mono
                       focus:outline-none focus:border-brand-primary"
            data-testid="step-3-email"
          />
          {form.email && !emailValid && (
            <p className="mt-1 text-xs text-red-500" data-testid="email-error">
              Please enter a valid email address
            </p>
          )}
        </div>
      </div>
    </div>,

    // Step 4 — confirmation
    <div key="step-4" data-testid="step-4-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Ready to submit
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        I will review your project details and be in touch within 24 hours to
        discuss next steps.
      </p>
      {form.project && (
        <p className="text-xs font-mono text-gray-400 border-l-2 border-brand-primary pl-3 mb-4">
          {form.project.slice(0, 80)}
          {form.project.length > 80 ? "..." : ""}
        </p>
      )}
      {submitError && (
        <p className="text-xs text-red-500" data-testid="submit-error">
          {submitError}
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
      totalSteps={5}
      isFirst={isFirst}
      isLast={isLast}
      onBack={back}
      onNext={nextHandler}
      onSubmit={handleSubmit}
    >
      {steps[step]}
    </ModalShell>
  );
};

export default DeliverProjectModal;
