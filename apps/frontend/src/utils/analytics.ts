import { hasConsent } from "./consent";
import { API_BASE } from "../config/api";

// Simple session ID — persists for the browser tab lifetime
const SESSION_ID = crypto.randomUUID();

const TRACKING_ENABLED =
  import.meta.env.VITE_ANALYTICS_TRACKING_ENABLED !== "false";

// ---------------------------------------------------------------------------
// Batch queue — events are held here and flushed every FLUSH_INTERVAL ms,
// or immediately when the tab becomes hidden (visibilitychange).
// ---------------------------------------------------------------------------
const FLUSH_INTERVAL = 2000; // ms

interface QueuedEvent {
  type: string;
  url: string;
  sessionId: string;
  payload: Record<string, unknown>;
}

const queue: QueuedEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flush(): void {
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  if (queue.length === 0) return;
  if (!TRACKING_ENABLED || !hasConsent()) {
    queue.length = 0;
    return;
  }

  const batch = queue.splice(0, queue.length);

  fetch(`${API_BASE}/api/v1/analytics/events/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events: batch }),
  }).catch(() => {
    // silently swallow — analytics must never crash the app
  });
}

// Flush immediately when the user navigates away / closes the tab
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
}

// ---------------------------------------------------------------------------

export const trackEvent = (
  eventName: string,
  payload: Record<string, unknown> = {},
) => {
  const event = {
    event: eventName,
    session_id: SESSION_ID,
    timestamp: Date.now(),
    page: window.location.pathname,
    ...payload,
  };
  console.log("[analytics]", event);

  // store in memory for dashboard and testing
  if (!window.__analyticsEvents) window.__analyticsEvents = [];
  window.__analyticsEvents.push(event);

  // queue for batched backend delivery
  if (!TRACKING_ENABLED || !hasConsent()) return;

  queue.push({
    type: eventName,
    url: window.location.href,
    sessionId: SESSION_ID,
    payload,
  });

  // Debounce: reset the timer on every new event
  if (flushTimer !== null) clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, FLUSH_INTERVAL);
};
