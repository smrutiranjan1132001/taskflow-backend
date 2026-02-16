const express = require("express");
const prisma = require("../prisma/client");
const { createTaskSchema } = require("../validations/task.validation");
const taskQueue = require("../queue/task.queue");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const data = createTaskSchema.parse(req.body);

    // Was a TEMP user (until auth was built)
    const userId = req.user.userId;

    const task = await prisma.task.create({
      data: {
        title: data.title,
        type: data.type,
        payload: data.payload,
        userId,
      },
    });

    await taskQueue.add(
      "processTask",
      { taskId: task.id },
      {
        jobId: task.id,
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

    res.status(201).json({
      message: "Task created and queued",
      task,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count(),
    ]);

    res.json({
      page,
      limit,
      total,
      tasks,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!task) {
      return res.status(404).json({
        error: {
          code: "TASK_NOT_FOUND",
          message: "Task not found",
        },
      });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
