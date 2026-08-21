const express = require("express");
const asyncHandler = require("../utils/asyncHandler");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");

const rbacController = require("../controllers/rbac.controller");

const router = express.Router();

// User + Admin
router.get(
  "/user-area",
  authenticate,
  authorize("user", "admin"),
  asyncHandler(rbacController.userArea),
);

// Admin only
router.get(
  "/admin-area",
  authenticate,
  authorize("admin"),
  asyncHandler(rbacController.adminArea),
);

module.exports = router;
