import { Worker, Job } from "bullmq";
import redisConnection from "../config/redis";

const worker = new Worker("alerts", 
    // checks for changes, sends SMS
    async job => {
        console.log(job.data)
    },
    { redisConnection },
);
