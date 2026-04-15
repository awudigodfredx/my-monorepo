const express = require("express");
const { emitEvent } = require("./analytics");
const { db } = require("./db");
const { messages, heroLeads, analyticsEvents } = require("./schema");

const app = express();

app.use(express.json());

// GET Health Check
app.get("/api/v1/health", (req, res) => {
  // emitEvent("request_success", { path: req.path }); // ✅ Emit technical event for monitoring
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

emitEvent("user_signup", { userId: 123 });

// POST Messages
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
    console.error("Error creating hero lead:", error);
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

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
