const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authController = require("../controllers/auth.controller");
// middleware to catch any validation error
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");

const router = express.Router();

// Register a new user
router.post(
  "/signup",
  registerValidation,
  validate,
  asyncHandler(authController.register),
);

// Login an existing user
router.post(
  "/login",
  loginValidation,
  validate,
  asyncHandler(authController.login),
);

router.get("/me", authenticate, asyncHandler(authController.getMe));

router.post("/refresh", asyncHandler(authController.refresh));

router.post("/logout", asyncHandler(authController.logout));

module.exports = router;
