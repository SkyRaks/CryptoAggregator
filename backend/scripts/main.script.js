import dotenv from 'dotenv';
import { getCoinMarketCapData } from './coinMarketCap.script.js';
import { getKrakenData } from './kraken.script.js';

dotenv.config({ path: "../../.env" });

// const coinMarketCapData = await getCoinMarketCapData("USD"); // this is hardcoded to see if it works
// const krakenData = await getKrakenData("USD"); // this is hardcoded to see if it works

console.log(await history(await getData("USD")));

const exchanges = [
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

async function history(exchangesData) {
    const historyData = {} 

    for (const [symbol, data] of Object.entries(exchangesData[0])) {

        const prices = exchangesData // this line creates array with objects that have 2 values, exchange and price
            .map(exchangesData => exchangesData[symbol])
            .map(coin => ({ exchange: coin.exchange, price: coin.price }));

        const max = prices.reduce((a, b) => (b.price > a.price ? b : a));
        const min = prices.reduce((a, b) => (b.price < a.price ? b : a));

        historyData[symbol] = {
            base_currency: data['base_currency'],
            quote_currency: data['quote_currency'],
            max_price: max.price,
            max_price_exchange: max.exchange,
            min_price: min.price,
            min_price_exchange: min.exchange
        }
    }
    return historyData
}

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
