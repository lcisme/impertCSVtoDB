const IORedis = require("ioredis");

const redisConnection = new IORedis({
  host: "localhost",
  port: 6379,
  db: 5,
  maxRetriesPerRequest: null,
});

module.exports = redisConnection;
