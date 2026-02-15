const { Worker } = require("bullmq");
const connection = require("../queue/connection");
const prisma = require("../prisma/client");

const worker = new Worker(
  "taskQueue",
  async (job) => {

    const { taskId } = job.data;

    console.log("Processing task:", taskId);

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "RUNNING",
      },
    });

    // simulate work
    await new Promise(resolve => setTimeout(resolve, 3000));

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "COMPLETED",
      },
    });

  },
  { connection }
);

worker.on("completed", (job) => {
  console.log("Task completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Task failed:", err);
});
