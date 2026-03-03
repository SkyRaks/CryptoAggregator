import Aggregated from "./models/aggregated.model.js";
import Market from "./models/market.model.js";
import User from "./models/user/user.model.js";

export let newExchange = null;  

export async function getSocketData(exchange) {
    newExchange = exchange
    const normalized = exchange.toLowerCase();

    let data;
    if (normalized === "aggregated") {
        data = await Aggregated.find({});
    } else {
        data = await Market.find({ exchange: normalized });
    }
    
    return data;
}

export async function getFavoriteSocketData(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) return []

        const favoriteList = user.favorites;
        let favoriteData = []; // put favorite data here

        for (let i = 0; i < favoriteList.length; i++) {
            let item;

            if (favoriteList[i].exchange === "aggregated") {
                item = await Aggregated.find({base_currency: favoriteList[i].symbol});                
            } else {
                item = await Market.find({base_currency: favoriteList[i].symbol});
            }
            if (item) favoriteData.push(item[0]);
        }
        
        return favoriteData;
    } catch (error) {
        console.error(error.message)
        throw error
    }
}
