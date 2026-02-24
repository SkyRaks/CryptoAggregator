import { Worker, Job } from "bullmq";
import redisConnection from "../config/redis";
import User from "../models/user/user.model";

const worker = new Worker("alerts", 
    // checks for changes, sends SMS
    async (job) => {
        // Queue will send alertId and then i will procces it here (one at the time)
        const alertId = job.alertId;
    },
    { connection: redisConnection },
);
