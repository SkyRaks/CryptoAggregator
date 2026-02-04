// import Coin from "../models/coin.model.js"
import Aggregated from "../models/aggregated.model.js"
import Market from "../models/market.model.js"

// export const getCoins = async (req, res) => {
//     try {
//         const coins = await Coin.find({});
//         res.status(200).json({success: true, data: coins});
//     } catch (error) {
//         console.log("error fetching coins", error.message);
//         res.status(500).json({success: false, message: error.message});
//     }
// };

// export const createCoins = async (req, res) => {
//     console.log(res.body);
//     const coin = req.body;

//     if (!coin.name || !coin.symbol || !coin.slug) {
//         return res.status(400).json({success: false, message: "provide all fields"});
//     }

//     const newCoin = new Coin(coin);

//     try {
//         await newCoin.save();
//         res.status(201).json({success: true, data: newCoin});
//     } catch (error) {
//         console.log("error in create object ", error.message);
//         res.status(500).json({success: false, message: "server error"});
//     }
// };

export const getExchangeData = async (req, res) => {
    // console.log('username: ', req.user.name);

    const { exchange } = req.body;
    const normalized = exchange.toLowerCase();

    try {
        let aggregatedData;

        if (normalized === "aggregated") {
            aggregatedData = await Aggregated.find({});
        } else {
            aggregatedData = await Market.find({ exchange: normalized });
        }

        console.log("records found: ", aggregatedData.length)

        res.status(200).json({success: true, data: aggregatedData});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9saXZlcjEyM0BtYWlsLmNvbSIsInBhc3N3b3JkIjoib2xpdmVyMTIzIiwiaWF0IjoxNzcwMDc0MjU4fQ.-yoZxaekJeoANQEUyqhyohNKMjUp0e3-4KNOWwZ6Q5o
