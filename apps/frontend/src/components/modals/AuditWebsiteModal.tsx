import React, { useEffect, useState } from "react";
import { EVENTS } from "@monorepo/shared";
import { useModalStepper } from "../../hooks/useModalStepper";
import ModalShell from "./ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormState {
  url: string;
  pain: string;
}

// simple URL validation — must start with http:// or https://
const isValidUrl = (val: string) => /^https?:\/\/.+/.test(val.trim());

const AuditWebsiteModal: React.FC<Props> = ({ open, onClose }) => {
  const { step, next, back, reset, isFirst, isLast } = useModalStepper(3);
  const [form, setForm] = useState<FormState>({ url: "", pain: "" });

  useEffect(() => {
    if (open) {
      console.log(EVENTS.AUDIT_WEBSITE_MODAL_OPEN, {
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // canProceed is only relevant on step 0 (URL validation)
  const canProceed = step === 0 ? isValidUrl(form.url) : true;

  const steps: React.ReactNode[] = [
    // Step 0 — website URL (with validation)
    <div key="step-0">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        Your website URL
      </label>
      <input
        type="url"
        value={form.url}
        onChange={update("url")}
        placeholder="https://yourwebsite.com"
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary"
        data-testid="step-0-url"
      />
      {form.url && !isValidUrl(form.url) && (
        <p
          className="text-xs text-red-500 mt-2 font-mono"
          data-testid="url-error"
        >
          Please enter a valid URL starting with https://
        </p>
      )}
    </div>,

    // Step 1 — main pain point
    <div key="step-1">
      <label className="block font-mono text-xs uppercase tracking-widest mb-3">
        What is your main pain point?
      </label>
      <textarea
        value={form.pain}
        onChange={update("pain")}
        rows={3}
        placeholder="e.g. slow load times, low conversions, unclear messaging..."
        className="w-full border border-gray-200 p-3 text-sm font-mono
                   focus:outline-none focus:border-brand-primary resize-none"
        data-testid="step-1-pain"
      />
    </div>,

    // Step 2 — confirmation
    <div key="step-2" data-testid="step-2-confirmation">
      <p className="font-mono text-xs uppercase tracking-widest text-brand-accent mb-4">
        Audit requested
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">
        I will review your site and send you actionable feedback within 48
        hours.
      </p>
      {form.url && (
        <p className="text-xs font-mono text-gray-400 border-l-2 border-brand-primary pl-3">
          {form.url}
        </p>
      )}
    </div>,
  ];

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Audit my website"
      step={step}
      totalSteps={3}
      isFirst={isFirst}
      isLast={isLast}
      onBack={back}
      onNext={canProceed ? next : undefined}
      onSubmit={handleClose}
    >
      {steps[step]}
    </ModalShell>
  );
};

export default AuditWebsiteModal;
