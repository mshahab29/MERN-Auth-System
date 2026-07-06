// load environment variables
require("dotenv").config();

const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
