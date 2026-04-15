import React from "react";

const PAGE_VIEW_EVENTS = [
  "hero_view",
  "hero_profile_card_view",
  "nav_logo_click",
];

interface PageViewsPanelProps {
  summary: Record<string, number>;
  loading: boolean;
  error: boolean;
}

const PageViewsPanel: React.FC<PageViewsPanelProps> = ({
  summary,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div
        className="bg-white border-2 border-brand-primary p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] animate-pulse"
        data-testid="page-views-panel"
      >
        <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-16 bg-gray-200 rounded mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-20 bg-gray-100 rounded" />
              <div className="h-3 w-8 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white border-2 border-red-400 p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
        data-testid="page-views-panel"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
          Page views
        </p>
        <p className="font-mono text-xs text-red-500 mt-4" role="alert" data-testid="page-views-error">
          Service unavailable — could not load data.
        </p>
      </div>
    );
  }

  const total = PAGE_VIEW_EVENTS.reduce(
    (sum, key) => sum + (summary[key] ?? 0),
    0,
  );

  if (total === 0) {
    return (
      <div
        className="bg-white border-2 border-brand-primary p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
        data-testid="page-views-panel"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
          Page views
        </p>
        <p
          className="font-mono text-xs text-gray-400 mt-4"
          data-testid="page-views-empty"
        >
          No page view data yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white border-2 border-brand-primary p-6
                 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
      data-testid="page-views-panel"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
        Page views
      </p>
      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="text-4xl font-display font-bold"
          data-testid="page-views-total"
        >
          {total}
        </span>
      </div>
      <div className="space-y-2">
        {PAGE_VIEW_EVENTS.map((key) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase text-gray-500">
              {key.replace(/_/g, " ")}
            </span>
            <span
              className="text-xs font-mono font-bold"
              data-testid={`page-views-${key}`}
            >
              {summary[key] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageViewsPanel;
