import React, { useEffect } from "react";
import { Modal as MUIModal, Box } from "@mui/material";
import { EVENTS } from "@monorepo/shared";
import { trackEvent } from "../../utils/analytics";

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  isFirst: boolean;
  isLast: boolean;
  onSubmit?: () => void;
}

const ModalShell: React.FC<ModalShellProps> = ({
  open,
  onClose,
  title,
  step,
  totalSteps,
  children,
  onBack,
  onNext,
  isFirst,
  isLast,
  onSubmit,
}) => {
  useEffect(() => {
    if (open) {
      trackEvent(EVENTS.MODAL_OPEN, { modal_title: title });
    }
  }, [open, title]);

  const handleClose = () => {
    trackEvent(EVENTS.MODAL_CLOSE, { modal_title: title });
    onClose();
  };

  return (
    <MUIModal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: 480,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}
      data-testid="modal-shell"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-lg font-display uppercase tracking-tight"
          data-testid="modal-title"
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={handleClose}
          data-testid="modal-close"
          className="text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? "bg-brand-primary" : "bg-gray-200"}`}
            data-testid={`step-bar-${i}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="mb-6" data-testid="modal-content">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            data-testid="modal-back"
            className="text-sm font-mono uppercase tracking-wider"
          >
            ← Back
          </button>
        )}
        {isLast ? (
          <button
            type="button"
            onClick={onSubmit}
            data-testid="modal-submit"
            className="bg-brand-primary text-white px-6 py-2 text-sm font-mono uppercase"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            data-testid="modal-next"
            className="bg-brand-primary text-white px-6 py-2 text-sm font-mono uppercase ml-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        )}
      </div>
    </Box>
  </MUIModal>
  );
};

export default ModalShell;
