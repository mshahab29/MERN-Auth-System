const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

// Middleware to catch validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  next();
};

module.exports = validate;
