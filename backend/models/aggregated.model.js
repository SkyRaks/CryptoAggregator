import mongoose from "mongoose";

const aggregatedSchema = new mongoose.Schema({
    base_currency: {
        type: String, // gonna look like BTC
        required: true
    },
    quote_currency: {
        type: String, // gonna look like USD
        required: true
    },
    price: { // in USD
        type: Number,
        required: true
    },
    volume_24h: {
        type: Number,
        required: true
    },
    percent_change_24h: {
        type: Number,
        required: true
    },
    percent_change_1h: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

const Aggregated = mongoose.model("Aggregated", aggregatedSchema);

export default Aggregated;
