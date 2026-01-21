import Market from "../models/market.model.js";
import { getData } from "./main.script.js";
import mongoose from "mongoose";


const CURRENCY = "USD";

// await createMarketData();

export async function createMarketData() { // "USD"
    // await mongoose.connect(process.env.MONGO_URI) // for debug
   
    const exchangesData = await getData();

    const marketData = {};

    for (let count = 0; count <= Object.keys(exchangesData).length - 1; count++) {
        for (const [symbol, data] of Object.entries(exchangesData[count])) {

            if (!marketData[symbol]) {
                marketData[symbol] = []
            }
            
            marketData[symbol].push({
                // mapping all of this as new hashmap
                exchange: data['exchange'],
                base_currency: data['base_currency'],
                quote_currency: CURRENCY,
                price: data['price'],
                volume_24h: data['volume_24h'],
                percent_change_24h: data['percent_change_24h'],
                percent_change_1h: data['percent_change_1h'],
            })
        }
    }

    try {
        const docs = Object.values(marketData).flat();

        await Market.insertMany(docs, { ordered: false });
        console.log(docs);
        console.log("market data inserted!")
        // await mongoose.connection.close();
    } catch (error) {
        console.log(error);
        throw error;
    }

}
