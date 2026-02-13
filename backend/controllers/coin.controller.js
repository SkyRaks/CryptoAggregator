// import Coin from "../models/coin.model.js"
import Aggregated from "../models/aggregated.model.js"
import Market from "../models/market.model.js"
import User from "../models/user/user.model.js";

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
    // console.log('username: ', req.user.id);

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

export const addFavorite = async (req, res) => {
    // next add if cases
    const userId = req.user.id;
    const {symbol, exchange} = req.body;

    try {
        const user = await User.findById(userId);
        
        const alreadyExists = user.favorites.some(coin => coin.symbol === symbol && coin.exchange === exchange)

        if (alreadyExists) return res.status(409).json({success: false, message: "coin already exists"});

        let newFav = {symbol, exchange};

        user.favorites.push(newFav);

        await user.save();
        res.status(201).json({success: true, data: newFav});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
};

export const removeFavorite = async (req, res) => {
    const userId = req.user.id;
    const {symbol, exchange} = req.body;

    try {
        if (!symbol || !exchange) res.status(400).json({success: false, message: "insuffisient fields"});

        const user = await User.findById(userId);

        let coinToRemove = null;

        for (let i = 0; i < user.favorites.length; i++) {
            if (user.favorites[i].symbol === symbol && user.favorites[i].exchange === exchange) {
                coinToRemove = user.favorites[i]._id;
                break;
            }
        }

        user.favorites.remove(coinToRemove);
        await user.save();
        
        res.status(200).json({success: true, message: "coin removed"});
    } catch (error) {
        res.status(404).json({success: false, message: error.message});
    }
};

export const getFavoriteData = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({success: false, message: "user not found"});

        const favoriteList = user.favorites;

        let favoriteData = []; // put favorite data here

        for ( let i = 0; i < favoriteList.length; i++) {
            let item;

            if (favoriteList[i].exchange === "aggregated") {
                item = await Aggregated.find({base_currency: favoriteList[i].symbol});
            } else {
                item = await Market.find({base_currency: favoriteList[i].symbol});
            }

            favoriteData.push(item[0])
        }
        console.log("my favorite data: ", favoriteData);    
        
        res.status(200).json({success: true, data: favoriteData});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}
