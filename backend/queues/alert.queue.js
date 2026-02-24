import { Queue } from "bullmq";
import redisConnection from "../config/redis";

const alertQueue = new Queue("alerts", {
    // Queues will be used by controllers
    connection: redisConnection,
});
