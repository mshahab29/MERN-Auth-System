const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  // Database
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15m",
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "7d",

  // OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

  // Email
  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: process.env.SMTP_PORT,
    USER: process.env.SMTP_USER,
    PASS: process.env.SMTP_PASS,
    FROM: process.env.SMTP_FROM,
  },
  // Client URL for CORS
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

const requiredEnvVariables = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const variable of requiredEnvVariables) {
  if (!env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

module.exports = env;
