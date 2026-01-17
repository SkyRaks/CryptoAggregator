import History from "../models/history.model.js";
import { getData } from "./main.script.js";

export async function createHistoryData() { // USD
    // this func will be triggered by node cron, every n time (as well as market script)
    // await mongoose.connect(process.env.MONGO_URI);
    const exchangesData = await getData();

    const historyData = {} 

    for (const [symbol, data] of Object.entries(exchangesData[0])) {

        const prices = exchangesData // this line creates array with objects that have 2 values, exchange and price
            .map(exchangesData => exchangesData[symbol])
            .map(coin => ({ exchange: coin.exchange, price: coin.price }));

        const max = prices.reduce((a, b) => (b.price > a.price ? b : a));
        const min = prices.reduce((a, b) => (b.price < a.price ? b : a));

        historyData[symbol] = {
            base_currency: data['base_currency'],
            quote_currency: data['quote_currency'],
            max_price: max.price,
            max_price_exchange: max.exchange,
            min_price: min.price,
            min_price_exchange: min.exchange
        }
    }

    try {
        const docs = Object.values(historyData);

        await History.insertMany(docs, {ordered: false});

        console.log("history data inserted successfully!")
    } catch (error) {
        console.log(error);
        throw error;
    }
}
