const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validateNote = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("content")
    .notEmpty()
    .withMessage("Content is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        new AppError(errors.array()[0].msg, 400)
      );
    }

    next();
  }
];

module.exports = validateNote;
