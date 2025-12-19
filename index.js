const express = require("express");
const connectDB = require("./db");
const Note = require("./models/Note");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const validateNote = require("./middleware/validateNote");

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

/* -------------------- NOTES CRUD -------------------- */

// CREATE (with validation)
app.post("/api/notes", validateNote, async (req, res, next) => {
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
      throw new AppError("Note not found", 404);
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
});

// UPDATE (with validation)
app.put("/api/notes/:id", validateNote, async (req, res, next) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      throw new AppError("Note not found", 404);
    }

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE
app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);

    if (!deleted) {
      throw new AppError("Note not found", 404);
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
});

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
