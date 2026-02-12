const { z } = require("zod");
// NOTE: Project intentionally uses Zod v3 (stable). Do not upgrade without review.

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["EMAIL", "REPORT", "SYNC"]),
  payload: z.record(z.any()).optional(),
});

module.exports = {
  createTaskSchema,
};