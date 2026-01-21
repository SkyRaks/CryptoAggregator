import { getData } from "./main.script.js";
import Aggregated from "../models/aggregated.model.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({ path: "../../.env" });

await aggregate("USD");

export async function aggregate(quote_currency) {
    
    const exchangesData = await getData();

    const aggregatedData = {}

    const fields = [ // fields what we need average data
        'price',
        'volume_24h',
        'percent_change_24h',
        'percent_change_1h',
    ];

    const symbols = new Set();

    for (const exchange of exchangesData) {
        Object.keys(exchange).forEach(symbol => symbols.add(symbol)); // it meand that we add keys of, not some field symbol
    }

    for (const symbol of symbols) {
        const entries = exchangesData.map(exchange => exchange[symbol]); // it looks like: [{btc(coinMarket)}, {btc(kraken)}],
        //  so it grouping things together                                                 [{eth(coinMarket)}, {eth(kraken)}]... 

        if (!entries.length) { continue } // it will skip missing exchanges

        aggregatedData[symbol] = { /// for each coin we create object, and put static values
            base_currency: entries[0].base_currency,
            quote_currency: entries[0].quote_currency,
        }

        for (const field of fields) { 
            aggregatedData[symbol][field] = // we access each field and adding to sum and dividing length
            // this is entry {eth(coinMarket)}, it is as index 
            entries.reduce((sum, entry) => sum += entry[field], 0) / entries.length;
        }
    }

    try {
        // await mongoose.connect(process.env.MONGO_URI)
        const docs = Object.values(aggregatedData).flat()

        await Aggregated.insertMany(docs, { ordered: false })

        console.log(docs);
        console.log("aggregated data inserted");
        // await mongoose.connection.close();
    } catch (error) {

        console.log(error.status)
        throw error;
    }
}


