import React, { useEffect, useState, useRef } from "react";
import { EVENTS } from "@monorepo/shared";
import { lazy, Suspense } from "react";

// lazy-load modals — only bundled when opened
const DeliverProjectModal = lazy(() => import("./modals/DeliverProjectModal"));
const MentorMeModal = lazy(() => import("./modals/MentorMeModal"));
const CoffeeWithMeModal = lazy(() => import("./modals/CoffeeWithMeModal"));

interface CtaOption {
  id: string;
  label: string;
  modal: string;
}

interface CtaConfig {
  workWithMe: {
    label: string;
    options: CtaOption[];
  };
}


const WorkWithMeCTA: React.FC = () => {
  const [cfg, setCfg] = useState<CtaConfig | null>(null);
  const [open, setOpen] = useState(false); // selector open/closed
  const [activeModal, setActive] = useState<string | null>(null); // which modal
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("../config/ctas.json").then((d) => setCfg(d.default));
  }, []);

  // close selector when clicking outside
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
    setOpen((prev) => !prev); // toggle
    console.log(EVENTS.WORK_WITH_ME_CTA_CLICK, { timestamp: Date.now() });
  };

  const handleOptionClick = (option: CtaOption) => {
    setOpen(false);
    setActive(option.id);
    // modal open event is emitted by the modal itself on mount
  };

  const handleModalClose = () => setActive(null);

  if (!cfg)
    return (
      // fallback while config loads
      <button
        className="bg-brand-primary text-white px-8 py-3 font-mono text-sm uppercase tracking-widest"
        disabled
      >
        Work with me
      </button>
    );

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      data-testid="work-with-me-cta"
    >
      {/* Primary button */}
      <button
        onClick={handleButtonClick}
        className="bg-brand-primary text-white px-8 py-3 font-mono text-sm
                   uppercase tracking-widest hover:bg-brand-accent transition-colors"
        data-testid="work-with-me-btn"
      >
        {cfg.workWithMe.label}
      </button>

      {/* Dropdown selector */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-56 bg-white border-2
                     border-brand-primary shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] z-50"
          data-testid="work-with-me-selector"
        >
          {cfg.workWithMe.options.map((option) => (
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
          ))}
        </div>
      )}

      {/* Modals — only mounted when active */}
      <Suspense fallback={null}>
        {activeModal === "deliver" && (
          <DeliverProjectModal open onClose={handleModalClose} />
        )}
        {activeModal === "mentor" && (
          <MentorMeModal open onClose={handleModalClose} />
        )}
        {activeModal === "coffee" && (
          <CoffeeWithMeModal open onClose={handleModalClose} />
        )}
      </Suspense>
    </div>
  );
};

export default WorkWithMeCTA;
