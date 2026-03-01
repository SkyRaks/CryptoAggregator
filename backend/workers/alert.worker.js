import { Worker, Job } from "bullmq";
import redisConnection from "../config/redis.js";

import User from "../models/user/user.model.js";
import Market from "../models/market.model.js";
import Aggregated from "../models/aggregated.model.js";
import Alert from "../models/alert.model.js";

import Twilio from "twilio";

export const worker = new Worker("alerts", 
    // checks for changes, sends SMS
    async (job) => {
        // Queue will send alertId and then i will procces it here (one at the time)
        const alertId = job.data.alertId;

        // get alert
        const userAlert = await Alert.findById(alertId);

        // alert fields (for now separate variables)
        const exchange = userAlert.exchange;
        const coin = userAlert.coin;
        const targetPrice = userAlert.targetPrice;
        
        console.log("before data");
        // find user's stuff
        let data = null;

        if (exchange.toString() === "aggregated") {
            data = await Aggregated.findOne({base_currency: coin});
        } else {
            data = await Market.findOne({exchange: exchange, base_currency: coin});
        }
        console.log("after");

        let comparison = false;
        let sign = null;

        switch (userAlert.comparison) {
            // it is bad i know, but idk if i can have if case inside switch
            case ">": 
                comparison = data.price > targetPrice;
                sign = "bigger"
                break
            case "<":
                comparison = data.price < targetPrice;
                sign = "smaller"
                break
            case ">=":
                comparison = data.price >= targetPrice;
                sign = "bigger or equal"
                break
            case "<=":
                comparison = data.price <= targetPrice;
                sign = "smaller or equal"
                break
        }
        
        if (comparison) {
            const user = await User.findById(userAlert.userId);
            const phoneNumber = user.phoneNumber;

            // twilio stuff
            const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

            const message = await client.messages.create({
                body: `${data.base_currency} is ${sign} than target value. Check it out!`,
                from: "+14179240379",
                // later maybe will change to custom country code even though it probablly will always be +1
                to: `+1${phoneNumber}`,
            })
            //
            
            // update alert record
            userAlert.status = "triggered";
            await userAlert.save();
            console.log(message.body);
        } else {
            return
        }
    },
    { connection: redisConnection },
);
