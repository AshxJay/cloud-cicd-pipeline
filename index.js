const express = require("express");
const connectDB = require("./db");
const Note = require("./models/Note");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- DATABASE -------------------- */
// IMPORTANT: connect once, reuse connection
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

/* -------------------- NOTES CRUD -------------------- */

// CREATE
app.post("/api/notes", async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

// READ ALL
app.get("/api/notes", async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

// READ ONE
app.get("/api/notes/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

// UPDATE
app.put("/api/notes/:id", async (req, res, next) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE
app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({
    error: err.message || "Internal Server Error"
  });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
