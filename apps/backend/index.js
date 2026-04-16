const express = require("express");
const cors = require("cors");
const { sql } = require("drizzle-orm");
const { emitEvent } = require("./analytics");
const { db } = require("./db");
const { messages, heroLeads, analyticsEvents } = require("./schema");

const app = express();

app.use(express.json());
const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const frontendUrl = rawFrontendUrl.endsWith("/") ? rawFrontendUrl.slice(0, -1) : rawFrontendUrl;

app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// -- Simple Auth Middleware --
const checkAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const password = process.env.ADMIN_PASSWORD || "admin123";

  if (authHeader === `Basic ${Buffer.from(`admin:${password}`).toString("base64")}`) {
    return next();
  }
  
  if (authHeader === password) {
    return next();
  }

  res.status(401).json({ error: "Unauthorized" });
};

// GET Health Check
app.get("/api/v1/health", (req, res) => {
  emitEvent("request_success", { path: req.path }); // ✅ Emit technical event for monitoring
  res.status(200).json({
    status: "ok",
  });
});

/**
 * GET Messages
 * Passive read operation → No business analytics event
 */
// app.get("/api/v1/messages", async (req, res) => {
//   const data = await db.select().from(messages);
//   res.status(200).json(data);
// });


// GET Messages
app.get("/api/v1/messages", async (req, res) => {
  try {
    const data = await db.select().from(messages);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      error: "Failed to fetch messages",
    });
  }
});

/**
 * POST Messages
 * Business action → Event-worthy (message_created)
 */
app.post("/api/v1/messages", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Insert into DB
    const result = await db.insert(messages).values({
      message,
    });

    // ✅ Emit business-level analytics event AFTER successful DB insert
    emitEvent("message_created", {
      messageLength: message.length,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error creating message:", error);

    res.status(500).json({
      error: "Failed to create message",
    });
  }
});

/**
 * POST /api/v1/hero/lead
 * Captures a lead submission from the hero section modals.
 */
app.post("/api/v1/hero/lead", async (req, res) => {
  try {
    const { name, email, message, source } = req.body;

    if (!name || !email || !message || !source) {
      return res.status(400).json({
        error: "name, email, message, and source are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    await db.insert(heroLeads).values({ name, email, message, source });

    emitEvent("hero_lead_created", { source });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("DIAGNOSTIC: Error creating hero lead:", error.stack);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

/**
 * POST /api/v1/analytics/events
 * Ingests a frontend analytics event and persists it to the database.
 */
app.post("/api/v1/analytics/events", async (req, res) => {
  try {
    const { type, url, sessionId, payload } = req.body;

    if (!type || !url || !sessionId) {
      return res.status(400).json({
        error: "type, url, and sessionId are required",
      });
    }

    await db.insert(analyticsEvents).values({
      type,
      url,
      sessionId,
      payload: payload ? JSON.stringify(payload) : null,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving analytics event:", error);
    res.status(500).json({ error: "Failed to save event" });
  }
});

/**
 * POST /api/v1/analytics/events/batch
 * Ingests a batch of frontend analytics events and persists them to the database.
 */
app.post("/api/v1/analytics/events/batch", async (req, res) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        error: "events must be a non-empty array",
      });
    }

    // Insert all events in the batch
    const values = events.map((e) => ({
      type: e.type,
      url: e.url,
      sessionId: e.sessionId,
      payload: e.payload ? JSON.stringify(e.payload) : null,
    }));

    await db.insert(analyticsEvents).values(values);

    res.status(201).json({ success: true, count: values.length });
  } catch (error) {
    console.error("DIAGNOSTIC: Error saving analytics event batch:", error.stack);
    res.status(500).json({ error: "Failed to save batch" });
  }
});

/**
 * GET /api/v1/analytics/summary
 * Returns aggregated counts of all events, grouped by type.
 * Protected: Requires admin authentication.
 */
app.get("/api/v1/analytics/summary", checkAdmin, async (req, res) => {
  try {
    const results = await db
      .select({
        type: analyticsEvents.type,
        count: sql`count(*)`.as("count"),
      })
      .from(analyticsEvents)
      .groupBy(analyticsEvents.type);

    // transform [{type: 'page_view', count: 5}] into {page_view: 5}
    const summary = results.reduce((acc, curr) => {
      acc[curr.type] = Number(curr.count);
      return acc;
    }, {});

    res.status(200).json(summary);
  } catch (error) {
    console.error("DIAGNOSTIC: Error fetching analytics summary:", error.stack);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
