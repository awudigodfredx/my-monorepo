// Simple session ID — persists for the browser tab lifetime
const SESSION_ID = crypto.randomUUID();

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
  console.log("[analytics]", event); // ← replace with real service later
};

// Usage in components:
// import { trackEvent } from '../utils/analytics';
// trackEvent(EVENTS.PAGE_VIEW, { referrer: document.referrer });
// to be imported and used in components like NavBar, HeroLeft, HeroRight, etc. for consistent analytics tracking across the app. Next day implementation.
