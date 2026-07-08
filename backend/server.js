const dotenv = require("dotenv");

// Setting up config file
dotenv.config({ path: "./config/config.env" });

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = require("./app");
const connectDatabase = require("./config/database");

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Connecting to database
connectDatabase();

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(
    `Server started on PORT: ${PORT} in ${process.env.NODE_ENV || "DEVELOPMENT"} mode.`
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");

  server.close(() => {
    process.exit(1);
  });
});