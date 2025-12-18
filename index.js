const express = require("express");
const connectDB = require("./db");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- ENV MESSAGE -------------------- */
const message = process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀";

/* -------------------- ROUTES -------------------- */
app.get("/", (req, res) => {
  res.send(message);
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.use("/api/notes", noteRoutes);

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
