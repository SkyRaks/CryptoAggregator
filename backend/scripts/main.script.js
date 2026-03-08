import { getCoinMarketCapData } from './exchangesScripts/coinMarketCap.script.js';
import { getKrakenData } from './exchangesScripts/kraken.script.js';
import { createHistoryData } from './history.script.js';
import { createMarketData } from './market.script.js';
import { patchAggregated } from './aggregate.script.js';
import cron from 'node-cron';
import { io, profileSockets } from '../server.js';
import { getFavoriteSocketData, getSocketData, newExchange } from '../socket-service.js';

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

const cronExpressionEvery10Minutes = "*/10 * * * *";
const cronExpressionEvery15Minutes = "*/15 * * * *";

const cronExpressionEveryMinute = "*/1 * * * *"; // every 2 minutes
const cronExpressionEvery5Minutes = "*/5 * * * *"; // every 5 minutes

let aggregateCounter = 1;
let marketAndHistoryCounter = 1;

let aggregateRunning = false;

export const cronAggregate = cron.schedule(cronExpressionEvery10Minutes, 
    async () => {
        // if (aggregateRunning) return;

        // aggregateRunning = true;

        // try {

        //     console.time("patchAggregated");
        //     await patchAggregated();
        //     console.timeEnd("patchAggregated");

        //     // get new data
        //     if (newExchange === "aggregated") {
        //         const data = await getSocketData('aggregated');
        //         const payload = data.map(coin => ({
        //             ...coin.toObject(),
        //             _id: coin._id.toString()
        //         }))

        //         // emit it to frontend
        //         io.emit("display-data", payload);
        //     }

        //     console.log("aggregate count: ", aggregateCounter);
        //     aggregateCounter += 1;
        // } catch (error) {
        //     console.error(error);
        // } finally {
        //     aggregateRunning = false;
        // }
        console.log("aggregate trigger")
    }, { scheduled: false, recoverMissedExecutions: false }
)

let marketAndHistoryRunning = false;

export const cronMarketAndHistory = cron.schedule(cronExpressionEvery15Minutes,
    async () => {
        // if (marketAndHistoryRunning) return

        // marketAndHistoryRunning = true;

        // try {
        //     console.time("createMarketData")
        //     await createMarketData();
        //     console.timeEnd("createMarketData")
        //     console.time("createHistoryData")
        //     await createHistoryData();
        //     console.timeEnd("createHistoryData")

        //     // get new data
        //     const marketData = await getSocketData(newExchange);
        //     const payload = marketData.map(coin => ({
        //         ...coin.toObject(),
        //         _id: coin._id.toString()
        //     }))

        //     // let it rideeee
        //     io.emit("display-data", payload);
        //     console.log("it should emit market data")

        //     console.log("market and history count: ", marketAndHistoryCounter);
        //     marketAndHistoryCounter += 1;   
        // } catch (error) {
        //     console.error(error);
        // } finally {
        //     marketAndHistoryRunning = false;
        // }
        console.log("market and history trigger")
    }, { scheduled: false, recoverMissedExecutions: false }
)

let profileRunning = false;

export const cronProfile = cron.schedule(cronExpressionEveryMinute,
    async () => {
        // if (profileRunning) return;

        // profileRunning = true;

        // try {
        //     for (const [userId, userSocket] of profileSockets) {
        //         const data = await getFavoriteSocketData(userId);

        //         const payload = data.map(coin => ({
        //             ...coin.toObject(),
        //             _id: coin._id.toString()
        //         }));

        //         userSocket.emit("profile-data", payload);
        //         console.log("emitting profile data");
        //     }   
        // } catch (error) {
        //     console.error(error);
        // } finally {
        //     profileRunning = false;
        // }
        console.log("cronProfile trigger")
    }, { scheduled: false, recoverMissedExecutions: false }
)
