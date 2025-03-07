const http = require("http");
const app = require("./src/config/server");
const ENV = require("./src/config/env");
const logger = require("./src/utils/logger");

const server = http.createServer(app);

const PORT = ENV.PORT || 5000;

// ✅ Start Server Logging (Goes to Combined Log & Console Only)
server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${ENV.NODE_ENV} mode`);
});

// ✅ Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  logger.errorLog.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// ✅ Handle Unhandled Rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.errorLog.error(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// ✅ Graceful Shutdown Handling
const shutdown = (signal) => {
  logger.info(`⚠️ ${signal} received, shutting down gracefully...`);
  server.close(() => {
    logger.info("🛑 Server closed.");
    process.exit(0);
  });
};

// ✅ Listen for termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
