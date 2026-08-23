const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const env = require("./config/env");
const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const rbacRoutes = require("./routes/rbac.routes");

const app = express();
app.set("trust proxy", 1);

// Global Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Middleware
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
// Data Sanitization against NoSQL Injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rbac", rbacRoutes);

// Global error handling middleware
app.use(errorHandler);

module.exports = app;
