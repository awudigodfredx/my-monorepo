import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHART_EVENTS = [
  { key: "hero_view", label: "Page View" },
  { key: "cta_work_click", label: "Work CTA" },
  { key: "cta_connect_click", label: "Connect CTA" },
  { key: "deliver_project_modal_open", label: "Deliver" },
  { key: "mentor_me_modal_open", label: "Mentor" },
  { key: "coffee_with_me_modal_open", label: "Coffee" },
  { key: "fifteen_min_chat_modal_open", label: "15 Min Chat" },
  { key: "audit_website_modal_open", label: "Audit" },
  { key: "tech_catchup_modal_open", label: "Tech Catch" },
];

const BAR_COLOR = "#14141e"; // brand-primary

interface EngagementChartProps {
  summary: Record<string, number>;
  loading: boolean;
  error: boolean;
}

const EngagementChart: React.FC<EngagementChartProps> = ({
  summary,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div
        className="bg-white border-2 border-brand-primary p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] animate-pulse h-56"
        data-testid="engagement-chart"
      >
        <div className="h-3 w-40 bg-gray-200 rounded mb-4" />
        <div className="flex items-end gap-3 h-32 mt-6">
          {[40, 70, 55, 80, 45, 60, 35, 50, 65].map((h, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded flex-1"
              style={{ height: `${h}%` }}
            />
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
        data-testid="engagement-chart"
      >
        <p className="font-mono text-xs text-red-500" role="alert">
          Chart unavailable — service error.
        </p>
      </div>
    );
  }

  const data = CHART_EVENTS.map(({ key, label }) => ({
    name: label,
    count: summary[key] ?? 0,
  }));

  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div
        className="bg-white border-2 border-brand-primary p-6
                   shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
        data-testid="engagement-chart"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-2">
          Engagement Overview
        </p>
        <p
          className="font-mono text-xs text-gray-400 mt-4"
          data-testid="chart-empty"
        >
          No engagement data yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-white border-2 border-brand-primary p-6
                 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
      data-testid="engagement-chart"
    >
      <p className="font-mono text-xs uppercase tracking-widest text-gray-400 mb-6">
        Engagement Overview
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontFamily: "monospace", fontSize: 10 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={52}
          />
          <YAxis
            tick={{ fontFamily: "monospace", fontSize: 10 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ fontFamily: "monospace", fontSize: 11 }}
            cursor={{ fill: "#f5f5f5" }}
          />
          <Bar dataKey="count" name="Events" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.count > 0 ? BAR_COLOR : "#e5e7eb"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementChart;
