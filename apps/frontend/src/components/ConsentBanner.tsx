import React, { useEffect, useState } from "react";
import { hasConsent, setConsent } from "../utils/consent";

const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if the user hasn't decided yet (no key in localStorage)
    try {
      if (localStorage.getItem("analytics_consent") === null) {
        setVisible(true);
      }
    } catch {
      // private browsing — skip banner
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setConsent(true);
    setVisible(false);
  };

  const handleDecline = () => {
    setConsent(false);
    setVisible(false);
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-brand-primary text-white
                 flex flex-col sm:flex-row items-start sm:items-center justify-between
                 gap-4 px-6 py-4 shadow-lg"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      data-testid="consent-banner"
    >
      <p className="text-sm font-mono leading-relaxed max-w-xl">
        This site uses analytics to understand how visitors use it. No personal
        data is sold or shared with third parties.
      </p>
      <div className="flex gap-3 shrink-0">
        <button
          type="button"
          onClick={handleDecline}
          className="border border-white/50 text-white font-mono text-xs uppercase
                     tracking-widest px-4 py-2 hover:bg-white/10 transition-colors"
          data-testid="consent-decline"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="bg-white text-brand-primary font-mono text-xs uppercase
                     tracking-widest px-4 py-2 hover:bg-gray-100 transition-colors"
          data-testid="consent-accept"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
