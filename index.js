const express = require("express");
const app = express();

// 🔹 Environment-based message
const message = process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀";

// 🔹 Main route
app.get("/", (req, res) => {
  res.send(message);
});

// 🔹 ADD THIS DEBUG ROUTE 👇
app.get("/env-check", (req, res) => {
  res.json({
    APP_MESSAGE: process.env.APP_MESSAGE || "NOT FOUND"
  });
});

// 🔹 Server starts LAST
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
