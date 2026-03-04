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

const cronExpressionEveryMinute = "*/1 * * * *"; // every minute
const cronExpressionEvery5Minutes = "*/5 * * * *"; // every 5 minutes

let aggregateCounter = 1;
let marketAndHistoryCounter = 1;

export const cronAggregate = cron.schedule(cronExpressionEveryMinute, 
    async () => {
    await patchAggregated();

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
    }, { scheduled: false }
)

export const cronMarketAndHistory = cron.schedule(cronExpressionEvery5Minutes,
    async () => {
    await createMarketData();
    await createHistoryData();

    // get new data
    const marketData = await getSocketData(newExchange);
    const payload = marketData.map(coin => ({
        ...coin.toObject(),
        _id: coin._id.toString()
    }))

    // let it rideeee
    io.emit("display-data", payload);
    console.log("it should emit market data")

    console.log("market and history count: ", marketAndHistoryCounter);
    marketAndHistoryCounter += 1;
    }, { scheduled: false }
)

export const cronProfile = cron.schedule(cronExpressionEveryMinute,
    async () => {
        for (const [userId, userSocket] of profileSockets) {
            const data = await getFavoriteSocketData(userId);

            const payload = data.map(coin => ({
                ...coin.toObject(),
                _id: coin._id.toString()
            }));

            userSocket.emit("profile-data", payload);
            console.log("emitting profile data");
        }
    }, { scheduled: false }
)
