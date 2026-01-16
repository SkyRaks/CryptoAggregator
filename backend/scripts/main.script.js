import dotenv from 'dotenv';
import { getCoinMarketCapData } from './exchangesScripts/coinMarketCap.script.js';
import { getKrakenData } from './exchangesScripts/kraken.script.js';
import { createHistoryData } from './history.script.js';
import { createMarketData } from './market.script.js';

dotenv.config({ path: "../../.env" });

// const coinMarketCapData = await getCoinMarketCapData("USD"); // this is hardcoded to see if it works
// const krakenData = await getKrakenData("USD"); // this is hardcoded to see if it works

export const exchanges = [
    getCoinMarketCapData,
    getKrakenData,
];

async function getData(currency) { // this function will call all of my exchanges, and make an array that history function uses
    // and i will use this function in aggregate function also
    const result = Promise.all(
        exchanges.map(fn => fn(currency))
    );

    return result
}

await createMarketData("USD");
// await createHistoryData(await getData("USD"));

// console.log(await aggregate());

async function aggregate() {
    const coinMarketCapData = await getCoinMarketCapData("USD"); // this is hardcoded to see if it works
    const krakenData = await getKrakenData("USD"); // this is hardcoded to see if it works

    const aggregatedData = {}

    // first, get all the fields
    for (const [symbol, data] of Object.entries(coinMarketCapData)) {
        // i'm looping through coinMarket and using that symbol to get that value in kraken

        //quote currency
        const coinMarketQuoteCurrency = data['quote_currency'];
        const krakenQuoteCurrency = krakenData[symbol]['quote_currency'];

        // price
        const coinMarketPrice = data['price'];
        const krakenPrice = krakenData[symbol]['price'];

        // volume
        const coinMarketVolume = data['volume_24h'];
        const krakenVolume = krakenData[symbol]['volume_24h'];

        // percent change 24h
        const coinMarketPercent24h = data['percent_change_24h'];
        const krakenPercent24h = krakenData[symbol]['percent_change_24h'];

        // percent change 1h
        const coinMarketPercent1h = data['percent_change_1h'];
        const krakenPercent1h = krakenData[symbol]['percent_change_1h'];

        aggregatedData[symbol] = {}

        if (coinMarketQuoteCurrency == krakenQuoteCurrency) aggregatedData[symbol]['quote_currency'] = coinMarketQuoteCurrency; // idk

        aggregatedData[symbol]['price'] = (coinMarketPrice + krakenPrice) / 2 // this should be a number of exchanges but for now it's 2

        aggregatedData[symbol]['volume_24h'] = (coinMarketVolume + krakenVolume) / 2; // volume

        aggregatedData[symbol]['percent_change_24h'] = (coinMarketPercent24h + krakenPercent24h) / 2; // percent change 24h

        aggregatedData[symbol]['percent_change_1h'] = (coinMarketPercent1h + krakenPercent1h) / 2; // percent change 1h
    }
    return aggregatedData;
}
