// apps/frontend/src/components/widgets/PageViewsPanel.tsx
import React, { useEffect, useState } from "react";

interface PageView {
  page: string;
  views: number;
}
interface PageViewsData {
  total: number;
  trend: string;
  byPage: PageView[];
}

const PageViewsPanel: React.FC = () => {
  const [data, setData] = useState<PageViewsData | null>(null);

  useEffect(() => {
    import("../../config/analyticsData.json").then((d) =>
      setData(d.default.pageViews),
    );
  }, []);

  if (!data) return null;

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
          {data.total}
        </span>
        <span
          className="text-xs font-mono text-brand-accent"
          data-testid="page-views-trend"
        >
          {data.trend}
        </span>
      </div>
      <div className="space-y-2">
        {data.byPage.map((p) => (
          <div key={p.page} className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase text-gray-500">
              {p.page}
            </span>
            <span
              className="text-xs font-mono font-bold"
              data-testid={`page-views-${p.page}`}
            >
              {p.views}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageViewsPanel;
