import { Queue } from "bullmq";
import redisConnection from "../config/redis";
import Alert from "../models/alert.model";

const alertQueue = new Queue("alerts", {
    // Queues will be used by controllers
    connection: redisConnection,
});

async function addJobs() {
    const data = await Alert.find({status: "pending"})

    for (const alert of data) {
        let alertId = data[alert]._id

        await alertQueue.add("check-alert", {
        alertId: alertId
    })
    }  
}
