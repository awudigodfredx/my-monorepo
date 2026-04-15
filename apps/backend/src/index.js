const express = require("express");
const { emitEvent } = require("../analytics");
const { db } = require("../db");
const { messages, analyticsEvents } = require("../schema");

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

if (require.main === module) {
  app.listen(3001, () => console.log("Backend running on port 3001"));
}

module.exports = app;
