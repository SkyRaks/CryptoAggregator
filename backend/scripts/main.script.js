import dotenv from 'dotenv';
import { getCoinMarketCapData } from './coinMarketCap.script.js';
import { main } from './kraken.script.js';

dotenv.config({ path: "../../.env" });

const coinMarketCapData = await getCoinMarketCapData("USD");
const krakenData = await main();

console.log(await aggregate());

// now i need to make json with fields to save to db

async function aggregate() {
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
