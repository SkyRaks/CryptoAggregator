import dotenv from 'dotenv';
import Coin from "../models/coin.model.js";
import mongoose from 'mongoose';

dotenv.config({ path: "../../.env" });

const API_KEY = process.env.COIN_MARKET_CAP_API_KEY;
const BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

// await mongoose.connect(process.env.MONGO_URI) // for debug
// getCoinMarketCapData("USD"); // for debug

export async function getCoinMarketCapData(quote_currency) {
    await mongoose.connect(process.env.MONGO_URI)

    const params = `?start=1&limit=15&convert=${quote_currency}`

    try {
        const res = await fetch(BASE_URL + params, {
            method: "GET",
            headers: {
                "Content-Type": "Application/json",
                "X-CMC_PRO_API_KEY": API_KEY,
            }
        })

        if (!res.ok) {
            console.log(`something went wrong: ${res.status}`);
        }

        const data = await res.json();
        const coinData = data['data']

        const marketModel = {};

        for (let coin = 0; coin < coinData.length; coin++) {

            const symbol = coinData[coin]['symbol']
            const checkForCoin = await Coin.findOne({symbol: symbol});

            if (!checkForCoin) continue; // if i don't have this coin in my coin model then skip it

            marketModel[symbol] = [];

            marketModel[symbol].push(quote_currency)
            const quote = coinData[coin]['quote'][quote_currency]
            marketModel[symbol].push(quote['price'])
            marketModel[symbol].push(quote['volume_24h'])
            marketModel[symbol].push(quote['percent_change_24h'])
            marketModel[symbol].push(quote['percent_change_1h'])
            marketModel[symbol].push("coinmarketcap")
            
            // this is allmost like market Model
            //  but exchange at the end, 
            // and base currency is the same as symbol

        } // reworked it to be object for better exthracting data later

        await mongoose.connection.close();
        return marketModel;
    } catch (error) {
        console.log(error.status);
    }
} 
// [
//   [
//     'BTC',
//     'USD',
//     89698.16841804927,
//     43821992587.51742,
//     1.87765574,
//     -0.64283622
//   ],
//   [
//     'ETH',
//     'USD',
//     3108.8388385092735,
//     23974655828.363747,
//     4.14411438,
//     -0.30223449
//   ],
//   'coinmarketcap'
// ]