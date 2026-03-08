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
const cronExpressionEveryHour = "0 * * * *";

const cronExpressionEveryMinute = "*/1 * * * *"; // every minute
const cronExpressionEvery5Minutes = "*/5 * * * *"; // every 5 minutes

let aggregateCounter = 1;
let marketCounter = 1;
let historyCounter = 1;

let aggregateRunning = false;

export const cronAggregate = cron.schedule(cronExpressionEveryMinute, 
    async () => {
        console.log("cronAggregate pid: ", process.pid)
        if (aggregateRunning) return;

        aggregateRunning = true;

        try {

            console.time("patchAggregated");
            await patchAggregated();
            console.timeEnd("patchAggregated");

            // get new data
            if (newExchange === "aggregated") {
                const data = await getSocketData('aggregated');
                const payload = data.map(coin => ({
                    ...coin.toObject(),
                    _id: coin._id.toString()
                }))

                // emit it to frontend
                io.emit("display-data", payload);
            }

            console.log("aggregate count: ", aggregateCounter);
            aggregateCounter += 1;
        } catch (error) {
            console.error(error);
        } finally {
            aggregateRunning = false;
        }
        console.log("aggregate trigger")
    }, { scheduled: false, recoverMissedExecutions: false }
)

let marketRunning = false;

export const cronMarket = cron.schedule(cronExpressionEvery15Minutes,
    async () => {
        console.log("cronMarket pid: ", process.pid)
        if (marketRunning) return

        marketRunning = true;

        try {
            console.time("createMarketData")
            await createMarketData();
            console.timeEnd("createMarketData")
            // console.time("createHistoryData")
            // await createHistoryData();
            // console.timeEnd("createHistoryData")

            // get new data
            const marketData = await getSocketData(newExchange);
            const payload = marketData.map(coin => ({
                ...coin.toObject(),
                _id: coin._id.toString()
            }))

            // let it rideeee
            io.emit("display-data", payload);
            console.log("it should emit market data")

            console.log("market count: ", marketCounter);
            marketCounter += 1;   
        } catch (error) {
            console.error(error);
        } finally {
            marketRunning = false;
        }
        console.log("market trigger")
    }, { scheduled: false, recoverMissedExecutions: false }
)

let historyRunning = false;

export const cronHistory = cron.schedule(cronExpressionEveryHour,
    async () => {
        if (historyRunning) return

        historyRunning = true;

        try {
            console.time("createHistoryData")
            await createHistoryData();
            console.timeEnd("createHistoryData")

            console.log("history count: ", historyCounter);
            historyCounter += 1;   
        } catch (error) {
            console.error(error);
        } finally {
            historyRunning = false;
        }
        console.log("history trigger")
    }, { scheduled: false, recoverMissedExecutions: false }
)

let profileRunning = false;

export const cronProfile = cron.schedule(cronExpressionEveryMinute,
    async () => {
        console.log("cronProfile pid: ", process.pid)
        if (profileRunning) return;

        profileRunning = true;

        try {
            for (const [userId, userSocket] of profileSockets) {
                const data = await getFavoriteSocketData(userId);

                const payload = data.map(coin => ({
                    ...coin.toObject(),
                    _id: coin._id.toString()
                }));

                userSocket.emit("profile-data", payload);
                console.log("emitting profile data");
            }   
        } catch (error) {
            console.error(error);
        } finally {
            profileRunning = false;
        }
        console.log("cronProfile trigger")
    }, { scheduled: false, recoverMissedExecutions: false }
)
