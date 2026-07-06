const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS Middleware
app.use(cors({ origin: env.CLIENT_URL }));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
