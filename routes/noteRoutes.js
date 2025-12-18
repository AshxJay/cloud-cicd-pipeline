const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

/* CREATE NOTE */
router.post("/", async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
});

module.exports = router;
