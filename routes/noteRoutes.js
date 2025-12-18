const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

/* CREATE */
router.post("/", async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
});

/* READ ALL */
router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

/* READ ONE */
router.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(note);
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

module.exports = router;
