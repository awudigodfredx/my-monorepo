const express = require("express");
const { emitEvent } = require("./analytics");

const app = express();

app.use(express.json());

// GET Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// POST Messages
app.post("/api/v1/messages", (req, res) => {
  emitEvent("request_received", {
    route: "/api/v1/messages",
  });

  const { message } = req.body;

  if (!message) {
    emitEvent("request_error", {
      route: "/api/v1/messages",
      reason: "missing_message",
    });

    return res.status(400).json({
      error: "Message is required",
    });
  }

  emitEvent("request_success", {
    route: "/api/v1/messages",
  });

  res.status(201).json({
    received: message,
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
