import Market from "../models/market.model.js";

export const createMarketCoin = async (req, res) => {

    if(!req.body || typeof req.body !== 'object') {return res.status(400).json({success: false, message: 'invalid body'})}

    const marketData = req.body;

    try {
        const docs = Object.values(marketData);
        
        const result = await Market.insertMany(docs, {ordered: false});
        res.status(201).json({success: true, data: result});
    } catch (error) {
        console.error("error in create market coin: ", error.message);
        res.status(500).json({success: false, message: 'server error'});
    }
};

// "ADA": {
//     "exchange": "kraken",
//     "base_currency": "ADA",
//     "quote_currency": "USD",
//     "price": 0.393075,
//     "volume_24h": 13015417.71278955,
//     "percent_change_24h": -0.6889005137691668,
//     "percent_change_1h": 0.18843196050834435
//     },
//   "BNB": {
//     "exchange": "kraken",
//     "base_currency": "BNB",
//     "quote_currency": "USD",
//     "price": 895.16,
//     "volume_24h": 561.68724,
//     "percent_change_24h": 0.34992485588030825,
//     "percent_change_1h": -0.02346499804458756
//     }
// }
