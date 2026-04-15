// apps/frontend/src/components/widgets/CTAClickPanel.tsx
import React, { useEffect, useState } from "react";

interface CtaData {
  total: number;
  trend: string;
}

interface CTAClickPanelProps {
  eventKey: string;
  label: string;
}

const CTAClickPanel: React.FC<CTAClickPanelProps> = ({ eventKey, label }) => {
  const [data, setData] = useState<CtaData | null>(null);

  useEffect(() => {
    import("../../config/analyticsData.json").then((d) => {
      const ctaClicks = d.default.ctaClicks as Record<string, CtaData>;
      setData(ctaClicks[eventKey] ?? null);
    });
  }, [eventKey]);

  if (!data) return null;

  return (
    <div
      className="bg-white border-2 border-brand-primary p-6
                 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
      data-testid="cta-click-panel"
      data-panel={eventKey}
    >
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-3">
        <span
          className="text-4xl font-display font-bold"
          data-testid={`panel-total-${eventKey}`}
        >
          {data.total}
        </span>
        <span
          className="text-xs font-mono text-brand-accent"
          data-testid={`panel-trend-${eventKey}`}
        >
          {data.trend}
        </span>
      </div>
      <p className="font-mono text-xs text-gray-300 mt-3 uppercase tracking-widest">
        clicks
      </p>
    </div>
  );
};

export default CTAClickPanel;
