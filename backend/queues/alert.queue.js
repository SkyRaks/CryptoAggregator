import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";
import Alert from "../models/alert.model.js";
import cron from "node-cron";

const alertQueue = new Queue("alerts", {
    // Queues will be used by controllers
    connection: redisConnection,
});

export async function addJobs() {
    const data = await Alert.find({status: "pending"})

    for (const alert of data) {
        await alertQueue.add("check-alert", {
        alertId: alert._id
    })
    }  
}

const cronExpressionEveryMinute = "*/1 * * * *"; // every minute

let alertAddJobsCount = 1;
let alertRunning = false;

export const cronAlert = cron.schedule(cronExpressionEveryMinute,
    async () => {
        // if (alertRunning) return;

        // alertRunning = true;

        // try {
        //     await addJobs();
        //     alertAddJobsCount += 1
        //     console.log("cronAlertTriggered count: ", alertAddJobsCount);   
        // } catch (error) {
        //     console.error(error);
        // } finally {
        //     alertRunning = false;
        // }
        console.log("cronAlert trigger");
    }, { scheduled: false, recoverMissedExecutions: false }
)
