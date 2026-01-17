import Market from "../models/market.model.js";
import { getData } from "./main.script.js";

const CURRENCY = "USD";

export async function createMarketData() { // "USD"
   
    const exchangesData = await getData();

    const marketData = {};
 
    for (const [symbol, data] of Object.entries(exchangesData[0])) {
        // taking every field in result array
        marketData[symbol] = { // mapping all of this as new hashmap
            exchange: data['exchange'],
            base_currency: data['base_currency'],
            quote_currency: CURRENCY,
            price: data['price'],
            volume_24h: data['volume_24h'],
            percent_change_24h: data['percent_change_24h'],
            percent_change_1h: data['percent_change_1h'],
        }
    }

    try {

        const docs = Object.values(marketData);

        await Market.insertMany(docs, { ordered: false });
        console.log("market data inserted!")
    } catch (error) {
        console.log(error);
        throw error;
    }

}
