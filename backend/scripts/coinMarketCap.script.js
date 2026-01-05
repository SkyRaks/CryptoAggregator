import dotenv from 'dotenv';
import Coin from "../models/coin.model.js";
// import mongoose from 'mongoose';

dotenv.config({ path: "../../.env" });

const API_KEY = process.env.COIN_MARKET_CAP_API_KEY;
const BASE_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

// await mongoose.connect(process.env.MONGO_URI) // for debug
// getCoinMarketCapData("USD"); // for debug

async function getCoinMarketCapData(quote_currency) {
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

        const marketModel = []

        for (let coin = 0; coin < coinData.length; coin++) {

            const name = coinData[coin]['name']
            const checkForCoin = await Coin.findOne({name: name});

            if (!checkForCoin) continue; // if i don't have this coin in my coin model then skip it

            marketModel[coin] = []

            // marketModel[coin].push(coinData[coin]['id']);
            marketModel[coin].push(coinData[coin]['symbol']);
            marketModel[coin].push(quote_currency)
            const quote = coinData[coin]['quote'][quote_currency]
            marketModel[coin].push(quote['price'])
            marketModel[coin].push(quote['volume_24h'])
            marketModel[coin].push(quote['percent_change_24h'])
            marketModel[coin].push(quote['percent_change_1h'])
            
            // this is allmost like market Model
            //  but exchange at the end, 
            // and base currency is the same as symbol
        }
        marketModel.push("coinmarketcap");

        console.log(marketModel);
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