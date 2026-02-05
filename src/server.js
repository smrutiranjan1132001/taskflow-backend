const app = require('./app')

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server Running on PORT : ${PORT}`)
})

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