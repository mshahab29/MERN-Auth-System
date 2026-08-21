const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const env = require("./config/env");
const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const rbacRoutes = require("./routes/rbac.routes");

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Middleware
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rbac", rbacRoutes);

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
