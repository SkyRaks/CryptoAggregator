import { getData } from "./main.script.js";
import Aggregated from "../models/aggregated.model.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({ path: "../../.env" });

export async function aggregate() {
    
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
        Object.keys(exchange).forEach(symbol => symbols.add(symbol)); // it mean that we add keys of, not some field symbol
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

await patchAggregated();

async function patchAggregated() {

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
        Object.keys(exchange).forEach(symbol => symbols.add(symbol)); // it mean that we add keys of, not some field symbol
    }

    for (const symbol of symbols) {
        await mongoose.connect(process.env.MONGO_URI)

        const entries = exchangesData.map(exchange => exchange[symbol]);

        if (!entries.length) { continue } 

        aggregatedData[symbol] = {} 

        for (const field of fields) { // aggregating data
            aggregatedData[symbol][field] = entries.reduce((sum, entry) => sum += entry[field], 0) / entries.length;
        }

        // next filter by symbol
        const coinFilter = await Aggregated.findOne({base_currency: symbol});

        if (!coinFilter) { continue } // if no coin then skip

        try {

            await Aggregated.updateOne( // updated those 4 fields for this coin
                { base_currency: symbol }, 
                { $set: aggregatedData[symbol] },
            )

            console.log("data patched!")
        } catch (error) {
            // await mongoose.connection.close();

            console.log(error);
            throw error;
        }
        
    }
    // await mongoose.connection.close();
}
