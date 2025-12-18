const express = require("express");
const app = express();

// Root route (reads env var at request time)
app.get("/", (req, res) => {
  res.send(process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀");
});

// Health check route (good cloud practice)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
