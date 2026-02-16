import { getCoinMarketCapData } from './exchangesScripts/coinMarketCap.script.js';
import { getKrakenData } from './exchangesScripts/kraken.script.js';
import { createHistoryData } from './history.script.js';
import { createMarketData } from './market.script.js';
import { aggregate, patchAggregated } from './aggregate.script.js';
import cron from 'node-cron';
import mongoose from 'mongoose';

const CURRENCY = "USD";

const exchanges = [
    getCoinMarketCapData,
    getKrakenData,
];

export async function getData() { 
    const result = await Promise.all(
        exchanges.map(fn => fn(CURRENCY))
    );

    return result;
}

const cronExpressionEvery3Minutes = "*/3 * * * *"; // every 3 minutes
const cronExpressionEvery10Minutes = "*/10 * * * *"; // every 5 minutes

let aggregateCounter = 1;
let marketAndHistoryCounter = 1;

async function isMongoConnected() {
    if (mongoose.connection.readyState !== 1) {
        console.log("mongo not connected")
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongo connected")
    }
}

// export function createCronAggregate() {
//     let aggregatedRunning = false;

//     return cron.schedule(cronExpressionEvery3Minutes, 
//         async () => {
//             if (aggregatedRunning) return;

//             aggregatedRunning = true;

//             try {
//                 console.log("cronAggregateCheck")
//                 await isMongoConnected();
//                 await patchAggregated();   
//                 console.log("aggregate count: ", aggregateCounter);
//                 aggregateCounter += 1;
//             } finally {
//                 aggregatedRunning = false;
//             }
//         }, {scheduled: false}
//     )   
// }

export const cronAggregate = cron.schedule(cronExpressionEvery3Minutes, 
    async () => {

    console.log("cronAggregateCheck")
    await isMongoConnected();
    await patchAggregated();

    console.log("aggregate count: ", aggregateCounter);
    aggregateCounter += 1;
    }, {sheduled: false}
)

export const cronMarketAndHistory = cron.schedule(cronExpressionEvery10Minutes, 
    async () => {
    await createMarketData();
    await createHistoryData();

    console.log("market and history count: ", marketAndHistoryCounter);
    marketAndHistoryCounter += 1;
    }, {scheduled: false}
)
