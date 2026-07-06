const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Register a new user
router.post("/signup", asyncHandler(authController.register));

// Login an existing user
router.post("/login", asyncHandler(authController.login));

module.exports = router;
