const { Worker } = require("bullmq");
const connection = require("../queue/connection");
const prisma = require("../prisma/client");
const logger = require("../utils/logger");

const worker = new Worker(
    "taskQueue",
    async (job) => {

        const { taskId } = job.data;

        // atomic start
        const task = await prisma.task.updateMany({
            where: {
                id: taskId,
                status: "PENDING",
            },
            data: {
                status: "RUNNING",
                attempts: { increment: 1 },
            },
        });

        if (task.count === 0) {
            return;
        }


        try {

            logger.info({ taskId }, "Processing task");

            // simulate work
            await new Promise(resolve => setTimeout(resolve, 3000));

            // atomic completion
            await prisma.task.update({
                where: { id: taskId },
                data: {
                    status: "COMPLETED",
                    result: { success: true },
                },
            });

        } catch (error) {

            await prisma.task.update({
                where: { id: taskId },
                data: {
                    status: "FAILED",
                    result: {
                        error: error.message,
                    },
                },
            });

            throw error;
        }
    },
    { connection }
);


worker.on("completed", async (job) => {
    logger.info({ jobId: job.id }, "Job completed");
});

worker.on("failed", async (job, err) => {
  logger.error({ jobId: job.id, error: err.message }, "Job failed");
});

process.on("SIGINT", async () => {
  await worker.close();
  process.exit(0);
});