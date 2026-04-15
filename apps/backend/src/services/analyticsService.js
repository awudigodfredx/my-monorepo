const { db } = require("../../db");
const { analyticsEvents } = require("../../schema");

const TRACKING_ENABLED = process.env.ANALYTICS_TRACKING_ENABLED !== "false";

/**
 * Persists a single analytics event to the database.
 * No-ops when ANALYTICS_TRACKING_ENABLED=false.
 * @param {{ type: string, url: string, sessionId: string, ctaId?: string, payload?: object }} event
 */
async function saveAnalyticsEvent({ type, url, sessionId, ctaId, payload }) {
  if (!TRACKING_ENABLED) return;
  await db.insert(analyticsEvents).values({
    type,
    url,
    sessionId,
    ctaId: ctaId ?? null,
    payload: payload ? JSON.stringify(payload) : null,
  });
}

module.exports = { saveAnalyticsEvent };
