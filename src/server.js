const app = require('./app')

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
})

async function shutdown() {
  logger.info("Shutdown signal received");

  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
}


process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// process is a global object by Node by .on() we can check if some type of issue is Occuring then what to do
//Below We are handling anything thats not wrapped under try/catch
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

//Below We are handling any Rejected/Unhandled Promise
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});