const express = require("express");
const { emitEvent } = require("./analytics");
const { db } = require("./db");
const { messages } = require("./schema");

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

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
