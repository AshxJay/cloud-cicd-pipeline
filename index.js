const express = require("express");
const path = require("path");
const swaggerUiDist = require("swagger-ui-dist");

const connectDB = require("./db");
const Note = require("./models/Note");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");
const validateNote = require("./middleware/validateNote");
const protect = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");

const swaggerSpec = require("./swagger");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- ROUTES -------------------- */

app.get("/", (req, res) => {
  res.send(process.env.APP_MESSAGE || "CI/CD Pipeline is working 🚀");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

/* -------------------- AUTH ROUTES -------------------- */
app.use("/api/auth", authRoutes);

/* -------------------- NOTES CRUD (PROTECTED) -------------------- */
app.post("/api/notes", protect, validateNote, async (req, res, next) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

app.get("/api/notes", protect, async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    next(err);
  }
});

app.get("/api/notes/:id", protect, async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) throw new AppError("Note not found", 404);
    res.json(note);
  } catch (err) {
    next(err);
  }
});

app.put("/api/notes/:id", protect, validateNote, async (req, res, next) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) throw new AppError("Note not found", 404);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/notes/:id", protect, async (req, res, next) => {
  try {
    const deleted = await Note.findByIdAndDelete(req.params.id);
    if (!deleted) throw new AppError("Note not found", 404);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
});

/* -------------------- SWAGGER (FINAL FIXED) -------------------- */

const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

// Serve Swagger UI assets
app.use("/api-docs", express.static(swaggerUiPath));

// Serve Swagger spec
app.get("/api-docs/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// Inject Swagger config properly
app.get("/api-docs", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Swagger UI</title>
  <link rel="stylesheet" href="/api-docs/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/api-docs/swagger-ui-bundle.js"></script>
  <script src="/api-docs/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: "/api-docs/swagger.json",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
  `);
});

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res, next) => {
  next(new AppError(\`Route \${req.originalUrl} not found\`, 404));
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
