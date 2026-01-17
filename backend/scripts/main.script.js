import dotenv from 'dotenv';
import { getCoinMarketCapData } from './exchangesScripts/coinMarketCap.script.js';
import { getKrakenData } from './exchangesScripts/kraken.script.js';
import { createHistoryData } from './history.script.js';
import { createMarketData } from './market.script.js';
import { aggregate } from './aggregate.script.js';
import cron from 'node-cron';

dotenv.config({ path: "../../.env" });

const exchanges = [
    getCoinMarketCapData,
    getKrakenData,
];

export async function getData() { 
    // and i will use this function in aggregate function also
    const currency = "USD";

    const result = await Promise.all(
        exchanges.map(fn => fn(currency))
    );

    return result;
}

// const cronExpression = "*/1 * * * *"; // every minute

// const task = cron.schedule(cronExpression, async () => {
//     const data = await getData("USD");

    
// });

// task.start();

// await createMarketData("USD");
// await createHistoryData("USD");
// console.log(await aggregate());
// console.log(await aggregate());
