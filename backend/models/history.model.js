import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    base_currency: { // BTC
        type: String,
        required: true
    },
    quote_currency: { // USD
        type: String,
        required: true
    },
    max_price: {
        type: Number,
        required: true
    }, 
    max_price_exchange: {
        type: String,
        required: true
    }, 
    min_price: {
        type: Number,
        required: true
    },
    min_price_exchange: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const History = mongoose.model("History", historySchema);

export default History;