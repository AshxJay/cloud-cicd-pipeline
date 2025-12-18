const express = require("express");
const app = express();

const message = process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀";

app.get("/", (req, res) => {
  res.send(message);
});

// 👇 THIS creates the /env-check URL
app.get("/env-check", (req, res) => {
  res.json({
    APP_MESSAGE: process.env.APP_MESSAGE || "NOT FOUND"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
