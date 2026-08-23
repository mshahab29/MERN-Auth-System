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
const { authLimiter } = require("../middleware/rateLimiter.middleware");

const router = express.Router();

// Register a new user
router.post(
  "/signup",
  authLimiter,
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
router.post(
  "/forgot-password",
  authLimiter,
  asyncHandler(authController.forgotPassword),
);
router.post(
  "/reset-password",
  authLimiter,
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

// Active Sessions Management
router.get("/sessions", authenticate, asyncHandler(authController.getSessions));
router.delete(
  "/sessions/other",
  authenticate,
  asyncHandler(authController.revokeOtherSessions),
);
router.delete(
  "/sessions/:sessionId",
  authenticate,
  asyncHandler(authController.revokeSession),
);

// Get the authenticated user's information
router.get("/me", authenticate, asyncHandler(authController.getMe));

module.exports = router;
