import { getData } from "./main.script.js";

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
    return aggregatedData;
}