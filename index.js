const express = require("express");
const connectDB = require("./db");
const Note = require("./models/Note");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const validateNote = require("./middleware/validateNote");
const protect = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- BASIC ROUTES -------------------- */
app.get("/", (req, res) => {
  res.send(process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

/* -------------------- AUTH ROUTES -------------------- */
app.use("/api/auth", authRoutes);

/* -------------------- NOTES CRUD (PROTECTED) -------------------- */

// CREATE
app.post("/api/notes", protect, validateNote, async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// READ ALL
app.get("/api/notes", protect, async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// READ ONE
app.get("/api/notes/:id", protect, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return next(new AppError("Note not found", 404));
    }
    res.json(note);
  } catch (err) {
    next(err);
  }
});

// UPDATE
app.put("/api/notes/:id", protect, validateNote, async (req, res, next) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return next(new AppError("Note not found", 404));
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE
app.delete("/api/notes/:id", protect, async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return next(new AppError("Note not found", 404));
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    next(err);
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
