import dotenv from 'dotenv';
import { getCoinMarketCapData } from './coinMarketCap.script.js';
import { main } from './kraken.script.js';

dotenv.config({ path: "../../.env" });

const coinMarketCapData = await getCoinMarketCapData("USD");
const krakenData = await main();

// await aggregate();

// now i need to make json with fields to save to db

async function aggregate() {
    const aggregatedData = {}

    // first, get all the fields
    for (const [symbol, data] of Object.entries(coinMarketCapData)) {
        // i'm looping through coinMarket and using that symbol to get that value in kraken

        //quote currency
        const coinMarketQuoteCurrency = data[0];
        const krakenQuoteCurrency = krakenData[symbol][0];

        // price
        const coinMarketPrice = data[1];
        console.log("coinMarket price: ", coinMarketPrice);
        const krakenPrice = krakenData[symbol][1];
        console.log("kraken price: ", krakenPrice)

        // volume
        const coinMarketVolume = data[2];
        const krakenVolume = krakenData[symbol][2];

        // percent change 24h
        const coinMarketPercent24h = data[3];
        const krakenPercent24h = krakenData[symbol][3];

        // percent change 1h
        const coinMarketPercent1h = data[3];
        const krakenPercent1h = krakenData[symbol][3];

        // as before i create array for coin and there willbe its values
        aggregatedData[symbol] = []

        // aggregatedData[symbol].push("USD") // i know it's hardcoded
        if (coinMarketQuoteCurrency == krakenQuoteCurrency) aggregatedData[symbol].push(coinMarketQuoteCurrency); // idk

        aggregatedData[symbol].push((coinMarketPrice + krakenPrice) / 2) // this should be a number of exchanges but for now it's 2

        aggregatedData[symbol].push((coinMarketVolume + krakenVolume) / 2); // volume

        aggregatedData[symbol].push((coinMarketPercent24h + krakenPercent24h) / 2); // percent change 24h

        aggregatedData[symbol].push((coinMarketPercent1h + krakenPercent1h) / 2); // percent change 1h
    }
    return aggregatedData;
}
