import dotenv from 'dotenv';
import Coin from "../models/coin.model.js";
import mongoose from 'mongoose';

dotenv.config({ path: "../../.env" });

const API_KEY = process.env.COIN_MARKET_CAP_API_KEY;
const BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

// await mongoose.connect(process.env.MONGO_URI) // for debug
// console.log(await getCoinMarketCapData("USD")); // for debug

export async function getCoinMarketCapData(quote_currency) {
    // await mongoose.connect(process.env.MONGO_URI)

    const params = `?start=1&limit=15&convert=${quote_currency}`

    try {
        const res = await fetch(BASE_URL + params, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CMC_PRO_API_KEY": API_KEY,
            }
        })

        if (!res.ok) {
            console.log(`something went wrong: ${res.status}`);
        }

        const data = await res.json();
        const coinData = data['data']

        const result = await getFields(coinData, quote_currency);

        // await mongoose.connection.close();
        return result;
    } catch (error) {
        console.log(error.status);
        throw error;
    }
} 

async function getFields(coinData, quote_currency) {
    await mongoose.connect(process.env.MONGO_URI)
    const marketModel = {};

    for (let coin = 0; coin < coinData.length; coin++) {

        const symbol = coinData[coin]['symbol']
        const checkForCoin = await Coin.findOne({symbol: symbol});

        if (!checkForCoin) continue; // if i don't have this coin in my coin model then skip it

        marketModel[symbol] = {};

        marketModel[symbol]['exchange'] = "coinmarketcap"
        marketModel[symbol]['base_currency'] = symbol;
        marketModel[symbol]['quote_currency'] = quote_currency;
        const quote = coinData[coin]['quote'][quote_currency]
        marketModel[symbol]['price'] = quote['price']
        marketModel[symbol]['volume_24h'] = quote['volume_24h']
        marketModel[symbol]['percent_change_24h'] = quote['percent_change_24h']
        marketModel[symbol]['percent_change_1h'] = quote['percent_change_1h']
        
        // this is allmost like market Model
        //  but exchange at the end, 
        // and base currency is the same as symbol
    }
    await mongoose.connection.close();

    return marketModel
}

//  BTC: {
//     quote_currency: 'USD',
//     price: 91015.2082757619,
//     volume_24h: 42315666878.04301,
//     percent_change_24h: -0.2696694,
//     percent_change_1h: -0.19849322,
//     market: 'coinmarketcap'
//   },
