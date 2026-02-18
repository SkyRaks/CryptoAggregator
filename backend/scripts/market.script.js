import Market from "../models/market.model.js";
import { getData } from "./main.script.js";
import mongoose from "mongoose";

const CURRENCY = "USD";

export async function createMarketData() { // "USD"
    const exchangesData = await getData();

    const marketData = {};

    if (mongoose.connection.readyState !== 1) { // check if mongoDB idling
        await mongoose.connect(process.env.MONGO_URI)
    }

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

        const ops = docs.map(doc => ({
            // i didn't know there is a thing like bulkWrite
            updateOne: {
                filter: {
                    exchange: doc.exchange,
                    base_currency: doc.base_currency,
                    quote_currency: doc.quote_currency,
                },
                update: {
                    price: doc.price,
                    volume_24h: doc.volume_24h,
                    percent_change_24h: doc.percent_change_24h,
                    percent_change_1h: doc.percent_change_1h,
                }
            },
            upsert: true
        }));

        await Market.bulkWrite(ops, {ordered: false});
        console.log("market data inserted!")
    } catch (error) {
        console.log(error);
        throw error;
    }
}
