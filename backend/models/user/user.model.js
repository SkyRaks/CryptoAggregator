import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        // match: /^\+[1-9]\d{1,14}$/,
        match: /^\d{10}$/, // just 10 numbers
        default: null,
    },
    refreshTokens: [String], 
    favorites: [
        {
            // type: mongoose.Schema.ObjectId,
            // ref: "UserCoin",
            symbol: { type: String, required: true },
            exchange: { type: String, required: true },
        }
    ]
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
