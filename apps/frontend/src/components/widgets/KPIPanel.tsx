import React from "react";

const CTA_EVENTS = ["cta_work_click", "cta_connect_click"];
const MODAL_EVENTS = [
  "deliver_project_modal_open",
  "mentor_me_modal_open",
  "coffee_with_me_modal_open",
  "fifteen_min_chat_modal_open",
  "audit_website_modal_open",
  "tech_catchup_modal_open",
];

interface KPIPanelProps {
  summary: Record<string, number>;
  loading: boolean;
  error: boolean;
}

interface KPI {
  label: string;
  value: string;
  description: string;
  testId: string;
}

function computeKPIs(summary: Record<string, number>): KPI[] {
  const pageViews = summary["hero_view"] ?? 0;
  const ctaClicks = CTA_EVENTS.reduce((s, k) => s + (summary[k] ?? 0), 0);
  const modalOpens = MODAL_EVENTS.reduce((s, k) => s + (summary[k] ?? 0), 0);

  const ctr =
    pageViews > 0 ? ((ctaClicks / pageViews) * 100).toFixed(1) + "%" : "—";
  const modalRate =
    ctaClicks > 0
      ? ((modalOpens / ctaClicks) * 100).toFixed(1) + "%"
      : "—";

  return [
    {
      label: "Click-Through Rate",
      value: ctr,
      description: "CTA clicks ÷ page views",
      testId: "kpi-ctr",
    },
    {
      label: "Modal Engagement Rate",
      value: modalRate,
      description: "Modal opens ÷ CTA clicks",
      testId: "kpi-modal-rate",
    },
  ];
}

const KPIPanel: React.FC<KPIPanelProps> = ({ summary, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-6" data-testid="kpi-panel">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border-2 border-brand-primary p-6
                       shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] animate-pulse"
          >
            <div className="h-3 w-32 bg-gray-200 rounded mb-4" />
            <div className="h-10 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-white border-2 border-red-400 p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
        data-testid="kpi-panel"
      >
        <p className="font-mono text-xs text-red-500" role="alert">
          KPI metrics unavailable.
        </p>
      </div>
    );
  }

  const kpis = computeKPIs(summary);

  return (
    <div className="grid grid-cols-2 gap-6" data-testid="kpi-panel">
      {kpis.map((kpi) => (
        <div
          key={kpi.testId}
          className="bg-white border-2 border-brand-primary p-6
                     shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
          data-testid={kpi.testId}
        >
          <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
            {kpi.label}
          </p>
          <p className="text-4xl font-display font-bold">{kpi.value}</p>
          <p className="font-mono text-xs text-gray-300 mt-3 uppercase tracking-widest">
            {kpi.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KPIPanel;
