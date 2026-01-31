import mongoose from "mongoose";

const userCoinSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    exchange: {
        type: String,
        required: true
    }
});

const UserCoin = mongoose.model("UserCoin", userCoinSchema);

export default UserCoin;
