import React, { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

import PageViewsPanel from "../components/widgets/PageViewsPanel";
import ModalOpensPanel from "../components/widgets/ModalOpensPanel";
import CTAClickPanel from "../components/widgets/CTAClickPanel";
import KPIPanel from "../components/widgets/KPIPanel";
import EngagementChart from "../components/widgets/EngagementChart";
import { API_BASE } from "../config/api";

const CTA_PANELS = [
  { eventKey: "cta_work_click", label: "Work With Me" },
  { eventKey: "cta_connect_click", label: "Connect With Me" },
  { eventKey: "deliver_project_modal_open", label: "Deliver Project" },
  { eventKey: "mentor_me_modal_open", label: "Mentor Me" },
  { eventKey: "coffee_with_me_modal_open", label: "Coffee With Me" },
];

const Dashboard: React.FC = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true); // true on first render → skeletons
  const [error, setError] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  // incrementing this triggers a re-fetch without synchronous setState in the effect
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    const password = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    fetch(`${API_BASE}/api/v1/analytics/summary`, {
      headers: {
        Authorization: `Basic ${btoa(`admin:${password}`)}`,
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Non-OK response");
        return r.json() as Promise<Record<string, number>>;
      })
      .then((data) => {
        if (!active) return;
        setSummary(data);
        setLastRefreshed(new Date());
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshTrigger]); // re-runs when user clicks Refresh

  // Called from event handlers (not from an effect) — setState here is fine
  const handleRefresh = () => {
    setLoading(true);
    setError(false);
    setRefreshTrigger((t) => t + 1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main>
      <section className="min-h-screen flex flex-col pb-20 max-w-7xl mx-auto">
        {/* Header */}
        <div className="p-6 mt-24 mb-2 flex items-center justify-between">
          <div>
            <h1
              className="font-display text-3xl uppercase tracking-tight"
              data-testid="dashboard-heading"
            >
              Analytics
            </h1>
            {lastRefreshed && !loading && (
              <p className="font-mono text-xs text-gray-400 mt-1">
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="border-2 border-brand-primary font-mono text-xs uppercase
                         tracking-widest px-4 py-2 hover:bg-brand-primary hover:text-white
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="refresh-button"
            >
              {loading ? "Refreshing…" : "↺ Refresh"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="font-mono text-xs uppercase tracking-widest text-gray-400
                         hover:text-brand-primary transition-colors"
              data-testid="logout-button"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Global error banner */}
        {error && (
          <div
            className="mx-6 mb-4 border-2 border-red-400 bg-red-50 px-4 py-3
                       flex items-center justify-between"
            role="alert"
            data-testid="dashboard-error-banner"
          >
            <p className="font-mono text-xs text-red-600">
              Analytics service unavailable. Data may be stale.
            </p>
            <button
              type="button"
              onClick={handleRefresh}
              className="font-mono text-xs underline text-red-600 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* KPI row */}
        <div className="px-6 mb-6">
          <Suspense fallback={null}>
            <KPIPanel summary={summary} loading={loading} error={error} />
          </Suspense>
        </div>

        {/* Chart — full width */}
        <div className="px-6 mb-6">
          <Suspense fallback={null}>
            <EngagementChart summary={summary} loading={loading} error={error} />
          </Suspense>
        </div>

        {/* Metric panels grid */}
        <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={null}>
            <PageViewsPanel
              summary={summary}
              loading={loading}
              error={error}
            />
            <ModalOpensPanel
              summary={summary}
              loading={loading}
              error={error}
            />
            {CTA_PANELS.map(({ eventKey, label }) => (
              <CTAClickPanel
                key={eventKey}
                eventKey={eventKey}
                label={label}
                summary={summary}
                loading={loading}
                error={error}
              />
            ))}
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
