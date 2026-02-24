import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    coin: {
        type: String, 
        required: true,
    },
    exchange: {
        type: String, 
        required: true,
    },
    targetPrice: {
        type: Number, 
        required: true,
    },
    comparison: {
        type: String, 
        enum: [">", "<", ">=", "<="],
        required: true,
    },
    phoneNumber: {
        type: String, 
        required: true,
    },
    status: {
        type: String, 
        enum: ["pending", "triggered"],
        default: "pending",
    }
}, {
    timestamps: true,
});

const Alert = mongoose.model("Alert", alertSchema);

export default Alert
