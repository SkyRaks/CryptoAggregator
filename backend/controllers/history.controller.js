import History from "../models/history.model.js";

export const createHistory = async (req, res) => {
    const historyData = req.body;

    try {
        const docs = Object.values(historyData);

        const result = await History.insertMany(docs, {ordered: false});
        res.status(201).json({success: true, data: result});
    } catch (error) {
        console.error("error in create history: ", error.message);
        res.status(500).json({success: false, message: 'server error'});
    }
};

// {
//   "BTC": {
//     "base_currency": "BTC",
//     "quote_currency": "USD",
//     "max_price": 90497.54660878512,
//     "max_price_exchange": "coinmarketcap",
//     "min_price": 90471.9,
//     "min_price_exchange": "kraken"
//   },
//   "ETH": {
//     "base_currency": "ETH",
//     "quote_currency": "USD",
//     "max_price": 3081.9214410558893,
//     "max_price_exchange": "coinmarketcap",
//     "min_price": 3080.11,
//     "min_price_exchange": "kraken"
//   }
// }
