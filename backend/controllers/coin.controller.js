import Coin from "../models/coin.model.js";

export const getCoins = async (req, res) => {
    try {
        const coins = await Coin.find({});
        res.status(200).json({success: true, data: coins});
    } catch (error) {
        console.log("error fetching coins", error.message);
        res.status(500).json({success: false, message: error.message});
    }
};

export const createCoins = async (req, res) => {
    console.log(res.body);
    const coin = req.body;

    if (!coin.name || !coin.symbol || !coin.slug) {
        return res.status(400).json({success: false, message: "provide all fields"});
    }

    const newCoin = new Coin(coin);

    try {
        await newCoin.save();
        res.status(201).json({success: true, data: newCoin});
    } catch (error) {
        console.log("error in create object ", error.message);
        res.status(500).json({success: false, message: "server error"});
    }
};

// [
//   [ 1, 'Bitcoin', 'BTC', 'bitcoin' ],
//   [ 1027, 'Ethereum', 'ETH', 'ethereum' ],
//   [ 825, 'Tether USDt', 'USDT', 'tether' ],
//   [ 1839, 'BNB', 'BNB', 'bnb' ],
//   [ 52, 'XRP', 'XRP', 'xrp' ],
//   [ 3408, 'USDC', 'USDC', 'usd-coin' ],
//   [ 5426, 'Solana', 'SOL', 'solana' ],
//   [ 1958, 'TRON', 'TRX', 'tron' ],
//   [ 74, 'Dogecoin', 'DOGE', 'dogecoin' ],
//   [ 2010, 'Cardano', 'ADA', 'cardano' ]
// ]