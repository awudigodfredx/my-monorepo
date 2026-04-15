// apps/frontend/src/components/widgets/PageViewsPanel.tsx
import React, { useEffect, useState } from "react";

const API_BASE =
  (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

const PAGE_VIEW_EVENTS = [
  "hero_view",
  "hero_profile_card_view",
  "nav_logo_click",
];

const PageViewsPanel: React.FC = () => {
  const [summary, setSummary] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/analytics/summary`)
      .then((r) => r.json())
      .then((data: Record<string, number>) => setSummary(data))
      .catch(() => setSummary({}));
  }, []);

  if (summary === null) {
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

  const total = PAGE_VIEW_EVENTS.reduce(
    (sum, key) => sum + (summary[key] ?? 0),
    0,
  );

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
