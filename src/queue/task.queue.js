const { Queue } = require("bullmq");
const connection = require("./connection");

const taskQueue = new Queue("taskQueue", {
  connection,
});

module.exports = taskQueue;
