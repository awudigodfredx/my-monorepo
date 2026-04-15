import React from "react";

interface CTAClickPanelProps {
  eventKey: string;
  label: string;
  summary: Record<string, number>;
  loading: boolean;
  error: boolean;
}

const CTAClickPanel: React.FC<CTAClickPanelProps> = ({
  eventKey,
  label,
  summary,
  loading,
  error,
}) => {
  if (loading) {
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

  if (error) {
    return (
      <div
        className="bg-white border-2 border-red-400 p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
        data-testid="cta-click-panel"
        data-panel={eventKey}
      >
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
          {label}
        </p>
        <p className="font-mono text-xs text-red-500 mt-4" role="alert" data-testid={`cta-click-error-${eventKey}`}>
          Service unavailable.
        </p>
      </div>
    );
  }

  const count = summary[eventKey] ?? 0;

  if (count === 0) {
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
        <p
          className="font-mono text-xs text-gray-400 mt-4"
          data-testid={`cta-click-empty-${eventKey}`}
        >
          No clicks recorded yet.
        </p>
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
