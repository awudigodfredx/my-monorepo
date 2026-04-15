const express = require("express");
const { emitEvent } = require("../analytics");
const { db } = require("../db");
const { messages } = require("../schema");
const { saveAnalyticsEvent } = require("./services/analyticsService");

const app = express();
app.use(express.json());

// GET Health Check
app.get("/api/v1/health", (req, res) => {
  emitEvent("request_success", { path: req.path });
  res.status(200).json({ status: "ok" });
});

// GET Messages
app.get("/api/v1/messages", async (req, res) => {
  try {
    const data = await db.select().from(messages);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST Messages
app.post("/api/v1/messages", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    await db.insert(messages).values({ message });

    emitEvent("message_created", { messageLength: message.length });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

/**
 * POST /api/v1/analytics/events
 * Ingests a frontend analytics event and persists it to the database.
 */
/**
 * GET /api/v1/analytics/summary
 * Returns event counts grouped by type for the admin dashboard.
 */
app.get("/api/v1/analytics/summary", async (_req, res) => {
  try {
    const { analyticsEvents } = require("../schema");
    const { sql } = require("drizzle-orm");
    const rows = await db
      .select({
        type: analyticsEvents.type,
        count: sql`COUNT(*)`.mapWith(Number),
      })
      .from(analyticsEvents)
      .groupBy(analyticsEvents.type);

    // shape: { page_view: 42, cta_work_click: 7, ... }
    const summary = Object.fromEntries(rows.map((r) => [r.type, r.count]));
    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

app.post("/api/v1/analytics/events", async (req, res) => {
  try {
    const { type, url, sessionId, ctaId, payload } = req.body;

    if (!type || !url || !sessionId) {
      return res.status(400).json({
        error: "type, url, and sessionId are required",
      });
    }

    await saveAnalyticsEvent({ type, url, sessionId, ctaId, payload });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving analytics event:", error);
    res.status(500).json({ error: "Failed to save event" });
  }
});

/**
 * POST /api/v1/analytics/events/batch
 * Ingests an array of frontend analytics events in a single request.
 */
app.post("/api/v1/analytics/events/batch", async (req, res) => {
  try {
    const { events } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "events must be a non-empty array" });
    }

    for (const ev of events) {
      const { type, url, sessionId, ctaId, payload } = ev;
      if (!type || !url || !sessionId) {
        return res.status(400).json({
          error: "each event must include type, url, and sessionId",
        });
      }
      await saveAnalyticsEvent({ type, url, sessionId, ctaId, payload });
    }

    res.status(201).json({ success: true, count: events.length });
  } catch (error) {
    console.error("Error saving analytics batch:", error);
    res.status(500).json({ error: "Failed to save batch" });
  }
});

if (require.main === module) {
  app.listen(3001, () => console.log("Backend running on port 3001"));
}

module.exports = app;
