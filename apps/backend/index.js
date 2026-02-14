const express = require("express");
const app = express();
app.use(express.json());

// GET Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// POST messages
app.post("/api/v1/messages", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }
  res.status(201).json({
    received: message,
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
