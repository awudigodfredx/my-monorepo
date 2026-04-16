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
  topic: string;
  time: string;
  name: string;
  email: string;
}


const FifteenMinChatModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(5);
  const [form, setForm] = useState<FormState>({
    topic: "",
    time: "",
    name: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      trackEvent(EVENTS.FIFTEEN_MIN_CHAT_MODAL_OPEN, {
        modal_name: "fifteen_min_chat",
        source: "help_me_free_cta",
      });
    }
  }, [open]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/hero/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `Topic: ${form.topic}\nTime: ${form.time}`,
          source: "fifteen_min_chat",
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      trackEvent(EVENTS.REQUEST_SUCCESS, { source: "fifteen_min_chat" });
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
        placeholder="e.g. career advice, technical question..."
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary resize-none"
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
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary"
        data-testid="step-1-time"
      >
        <option value="">Select time...</option>
        <option>Weekday morning (8am–12pm)</option>
        <option>Weekday afternoon (12pm–5pm)</option>
        <option>Weekday evening (6pm–9pm)</option>
        <option>Weekend</option>
      </select>
    </div>,

    // Step 2 — name
    <div key="step-2">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        Your name
      </label>
      <input
        type="text"
        value={form.name}
        onChange={update("name")}
        placeholder="Full name"
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary"
        data-testid="step-2-name"
      />
    </div>,

    // Step 3 — email
    <div key="step-3">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        Email address
      </label>
      <input
        type="email"
        value={form.email}
        onChange={update("email")}
        placeholder="you@example.com"
        className="w-full border border-gray-200 p-3 text-sm font-mono focus:outline-none focus:border-brand-primary"
        data-testid="step-3-email"
      />
      {form.email && !emailValid && (
        <p className="mt-1 text-xs text-red-500">
          Please enter a valid email address
        </p>
      )}
    </div>,

    // Step 4 — confirmation
    <div key="step-4" data-testid="step-4-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Ready to book
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        I will reach out within 24 hours to confirm your 15-minute slot.
      </p>
      {submitting && <p className="text-xs text-brand-primary animate-pulse">Submitting...</p>}
      {submitError && <p className="text-xs text-red-500">{submitError}</p>}
    </div>,
  ];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="15 min chat"
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

export default FifteenMinChatModal;
