import Aggregated from "./models/aggregated.model.js";
import Market from "./models/market.model.js";

export async function getSocketData(exchange) {
    const normalized = exchange.toLowerCase();

    let data;
    if (normalized === "aggregated") {
        data = await Aggregated.find({});
    } else {
        data = await Market.find({ exchange: normalized });
    }
    console.log(data);
    
    return data;
}