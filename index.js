const express = require("express");
const connectDB = require("./db");
const Note = require("./models/Note");

/* ---------- Swagger ---------- */
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management API
 */

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- DATABASE -------------------- */
connectDB().catch(console.error);

/* -------------------- SWAGGER DOCS -------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------- ROUTES -------------------- */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Returns deployment message
 *     responses:
 *       200:
 *         description: App is running
 */
app.get("/", (req, res) => {
  res.send(process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀");
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns API health status
 *     responses:
 *       200:
 *         description: API is healthy
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

/* -------------------- NOTES CRUD -------------------- */

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 */
app.post("/api/notes", async (req, res, next) => {
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
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: List of notes
 */
app.get("/api/notes", async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a note by ID
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note found
 *       404:
 *         description: Note not found
 */
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

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       404:
 *         description: Note not found
 */
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

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 */
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
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Internal Server Error"
  });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
