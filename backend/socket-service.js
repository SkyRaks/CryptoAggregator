import Aggregated from "./models/aggregated.model.js";
import Market from "./models/market.model.js";
import User from "./models/user/user.model.js";

export async function getSocketData(exchange) {
    const normalized = exchange.toLowerCase();

    let data;
    if (normalized === "aggregated") {
        data = await Aggregated.find({});
    } else {
        data = await Market.find({ exchange: normalized });
    }
    // console.log(data);
    
    return data;
}

// export const getFavoriteData = async (req, res) => {
//     const userId = req.user.id;
//     try {
//         const user = await User.findById(userId);
//         if (!user) return res.status(404).json({success: false, message: "user not found"});
//         const favoriteList = user.favorites;
//         let favoriteData = []; // put favorite data here
//         for ( let i = 0; i < favoriteList.length; i++) {
//             let item;
//             if (favoriteList[i].exchange === "aggregated") {
//                 item = await Aggregated.find({base_currency: favoriteList[i].symbol});
//             } else {
//                 item = await Market.find({base_currency: favoriteList[i].symbol});
//             }
//             favoriteData.push(item[0])
//         }
//         // console.log("my favorite data: ", favoriteData);    
//         res.status(200).json({success: true, data: favoriteData});
//     } catch (error) {
//         res.status(500).json({success: false, message: error.message});
//     }
// }

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
            favoriteData.push(item[0]);
        }

        return favoriteData;
    } catch (error) {
        console.error(error.message)
        throw error
    }
}
