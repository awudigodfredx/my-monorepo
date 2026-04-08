const isProd = import.meta.env.MODE === "production";

export function trackEvent(eventName, payload = {}) {
  if (!isProd) {
    console.log("Event tracked:", eventName, payload);
    return;
  }

  console.log("[PROD] Sending event:", eventName, payload);

  // Later replace with real analytics service
  // sendToAnalytics(eventName, payload);
}
