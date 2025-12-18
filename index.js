const express = require("express");
const connectDB = require("./db");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- ROUTES -------------------- */

// Root
app.get("/", (req, res) => {
  res.send(process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀");
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

// Notes API
app.use("/api/notes", noteRoutes);

/* -------------------- ERROR HANDLER (IMPORTANT) -------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
