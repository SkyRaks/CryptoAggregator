import IORedis from "ioredis";

const redisConnection = new IORedis(
    // for prod redis, for dev localhost
    process.env.REDIS_URL || {
        host: "redis",
        port: 6379,
        maxRetriesPerRequest: null,
    },
);

export default redisConnection;
