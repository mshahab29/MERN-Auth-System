const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authController = require("../controllers/auth.controller");
// middleware to catch any validation error
const validate = require("../middleware/validate.middleware");
const authenticate = require("../middleware/auth.middleware");
const {
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  resendVerificationValidation,
} = require("../validators/auth.validator");

const router = express.Router();

// Register a new user
router.post(
  "/signup",
  registerValidation,
  validate,
  asyncHandler(authController.register),
);

router.get("/verify-email", asyncHandler(authController.verifyEmail));
router.post(
  "/resend-verification",
  resendVerificationValidation,
  validate,
  asyncHandler(authController.resendVerification),
);
router.post("/forgot-password", asyncHandler(authController.forgotPassword));
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  asyncHandler(authController.resetPassword),
);

// Login an existing user
router.post(
  "/login",
  loginValidation,
  validate,
  asyncHandler(authController.login),
);

// Login with Google
router.post("/google-login", asyncHandler(authController.googleLogin));

router.post("/google-signup", asyncHandler(authController.googleSignup));

// get new access token using refresh token
router.post("/refresh", asyncHandler(authController.refresh));

// Logout user
router.post("/logout", asyncHandler(authController.logout));

// Get the authenticated user's information
router.get("/me", authenticate, asyncHandler(authController.getMe));

module.exports = router;
