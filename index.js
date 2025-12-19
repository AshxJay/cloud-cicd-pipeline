const express = require("express");
const connectDB = require("./db");
const Note = require("./models/Note");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const validateNote = require("./middleware/validateNote");
const protect = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- ROUTES -------------------- */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     responses:
 *       200:
 *         description: API running
 */
app.get("/", (req, res) => {
  res.send(process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀");
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is healthy
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

/* -------------------- AUTH ROUTES -------------------- */
app.use("/api/auth", authRoutes);

/* -------------------- NOTES CRUD (PROTECTED) -------------------- */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a note
 *     security:
 *       - bearerAuth: []
 */
app.post("/api/notes", protect, validateNote, async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes
 *     security:
 *       - bearerAuth: []
 */
app.get("/api/notes", protect, async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a single note
 *     security:
 *       - bearerAuth: []
 */
app.get("/api/notes/:id", protect, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) throw new AppError("Note not found", 404);
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     security:
 *       - bearerAuth: []
 */
app.put("/api/notes/:id", protect, validateNote, async (req, res, next) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) throw new AppError("Note not found", 404);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     security:
 *       - bearerAuth: []
 */
app.delete("/api/notes/:id", protect, async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) throw new AppError("Note not found", 404);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
});

/* -------------------- SWAGGER UI (CORRECT) -------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
