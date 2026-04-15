// apps/frontend/src/components/widgets/CTAClickPanel.tsx
import React, { useEffect, useState } from "react";

const API_BASE =
  (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

interface CTAClickPanelProps {
  eventKey: string;
  label: string;
}

const CTAClickPanel: React.FC<CTAClickPanelProps> = ({ eventKey, label }) => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/analytics/summary`)
      .then((r) => r.json())
      .then((data: Record<string, number>) => setCount(data[eventKey] ?? 0))
      .catch(() => setCount(0));
  }, [eventKey]);

  if (count === null) {
    return (
      <div
        className="bg-white border-2 border-brand-primary p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] animate-pulse"
        data-testid="cta-click-panel"
        data-panel={eventKey}
      >
        <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-16 bg-gray-200 rounded" />
      </div>
    );
  }

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
          {count}
        </span>
      </div>
      <p className="font-mono text-xs text-gray-300 mt-3 uppercase tracking-widest">
        clicks
      </p>
    </div>
  );
};

export default CTAClickPanel;
