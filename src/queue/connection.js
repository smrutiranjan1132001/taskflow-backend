const { Redis } = require("ioredis");

const connection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
   maxRetriesPerRequest: null,
});

module.exports = connection;
