import Coin from "../models/coin.model.js";
import { getData } from "./main.script.js";

console.log(await aggregate());

export async function aggregate() {
    
    const exchangesData = await getData();

    const aggregatedData = {}

    const fields = [
        'price',
        'volume_24h',
        'percent_change_24h',
        'percent_change_1h',
    ];

    const symbols = new Set();
    for (const exchange of exchangesData) {
        Object.keys(exchange).forEach(symbol => symbols.add(symbol));
    }

    for (const symbol of symbols) {
        const entries = exchangesData.map(exchange => exchange[symbol]);

        if (!entries.length) { continue }

        aggregatedData[symbol] = {
            base_currency: entries[0].base_currency,
            quote_currency: entries[0].quote_currency,
        }

        for (const field of fields) {
            aggregatedData[symbol][field] = 
            entries.reduce((sum, entry) => sum += entry[field], 0)
            / entries.length;
        }
    }
    return aggregatedData;
}