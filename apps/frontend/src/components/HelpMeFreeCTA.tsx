import React, { useEffect, useState, useRef } from "react";
import { EVENTS } from "@monorepo/shared";
import { lazy, Suspense } from "react";
import { trackEvent } from "../utils/analytics";

// lazy-load modals — only bundled when opened
// ← changed: different modals
const FifteenMinChatModal = lazy(() => import("./modals/FifteenMinChatModal"));
const AuditWebsiteModal = lazy(() => import("./modals/AuditWebsiteModal"));
const TechCatchupModal = lazy(() => import("./modals/TechCatchupModal"));

interface CtaOption {
  id: string;
  label: string;
  modal: string;
}

// ← changed: helpMeFree is a flat object, not nested under a key
interface CtaConfig {
  label: string;
  options: CtaOption[];
}

// ← changed: component name
const HelpMeFreeCTA: React.FC = () => {
  const [cfg, setCfg] = useState<CtaConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [activeModal, setActive] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ← changed: read helpMeFree key from the config
    import("../config/ctas.json").then((d) => setCfg(d.default.helpMeFree));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    setOpen((prev) => !prev);
    // ← changed: different event
    trackEvent(EVENTS.HELP_ME_FREE_CTA_CLICK, {
      element_id: "help-me-free-btn",
    });
  };

  const handleOptionClick = (option: CtaOption) => {
    setOpen(false);
    setActive(option.id);
  };

  const handleModalClose = () => setActive(null);

  if (!cfg)
    return (
      // ← changed: outline style + fallback label
      <button
        className="border-2 border-brand-primary text-brand-primary px-8 py-3
                   font-mono text-sm uppercase tracking-widest"
        disabled
      >
        Help me free
      </button>
    );

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      data-testid="help-me-free-cta" // ← changed
    >
      {/* ← changed: outline button style */}
      <button
        onClick={handleButtonClick}
        className="border-2 border-brand-primary text-brand-primary px-8 py-3
                   font-mono text-sm uppercase tracking-widest
                   hover:bg-brand-primary hover:text-white transition-colors"
        data-testid="help-me-free-btn" // ← changed
      >
        {cfg.label} {/* ← changed: flat, not cfg.helpMeFree.label */}
      </button>

      {/* Dropdown selector */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-56 bg-white border-2
                     border-brand-primary shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] z-50"
          data-testid="help-me-free-selector" // ← changed
        >
          {cfg.options.map(
            (
              option, // ← changed: flat, not cfg.helpMeFree.options
            ) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left px-4 py-3 font-mono text-xs uppercase
                         tracking-wider hover:bg-brand-primary hover:text-white
                         transition-colors border-b border-gray-100 last:border-b-0"
                data-testid={`option-${option.id}`}
              >
                {option.label}
              </button>
            ),
          )}
        </div>
      )}

      {/* ← changed: different modals */}
      <Suspense fallback={null}>
        {activeModal === "chat" && (
          <FifteenMinChatModal open onClose={handleModalClose} />
        )}
        {activeModal === "audit" && (
          <AuditWebsiteModal open onClose={handleModalClose} />
        )}
        {activeModal === "catchup" && (
          <TechCatchupModal open onClose={handleModalClose} />
        )}
      </Suspense>
    </div>
  );
};

export default HelpMeFreeCTA; // ← changed
