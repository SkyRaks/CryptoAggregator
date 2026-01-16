import Market from "../models/market.model.js";
import { exchanges } from "../scripts/main.script.js"
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export async function createMarketData(currency) { // "USD"
    // similar to history script but for market
    const result = await Promise.all(
        // looping through every exchange function
        exchanges.map(fn => fn(currency))
    );

    const marketData = {};
 
    for (const [symbol, data] of Object.entries(result[0])) {
        // taking every field in result array
        marketData[symbol] = { // mapping all of this as new hashmap
            exchange: data['exchange'],
            base_currency: data['base_currency'],
            quote_currency: currency,
            price: data['price'],
            volume_24h: data['volume_24h'],
            percent_change_24h: data['percent_change_24h'],
            percent_change_1h: data['percent_change_1h'],
        }
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);

        const docs = Object.values(marketData);
        console.log(docs);

        await Market.insertMany(docs, { ordered: false });
        console.log("market data inserted!")

        await mongoose.connection.close();
    } catch (error) {
        await mongoose.connection.close();

        console.log(error);
        throw error;
    }

}
