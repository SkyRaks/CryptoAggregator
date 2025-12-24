import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    coin_id: { // id from coin model
        type: mongoose.Schema.Types.ObjectId, ref: 'Coin',
        required: true
    },
    base_currency: { // BTC
        type: String,
        required: true
    },
    quote_currency: { // USD
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    max_price: {
        type: Number,
        required: true
    }, 
    min_price: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

const History = mongoose.model("History", historySchema);

export default History;