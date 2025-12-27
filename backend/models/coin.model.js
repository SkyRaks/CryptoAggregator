import mongoose from "mongoose";

const coinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Coin = mongoose.model("Coin", coinSchema);

export default Coin;