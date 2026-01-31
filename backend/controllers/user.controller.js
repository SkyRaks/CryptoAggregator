import User from "../models/user/user.model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";;
import dotenv from 'dotenv';

dotenv.config({ path: "../../CryptoAggregator/.env" });

export const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.status(400).json({success: false, message: "bad credentials"});

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({success: true, message: "user registered"})
    } catch (error) {
        console.log("failed to register user")
        res.status(500).json({success: false, message: "server register error"});
    }
};

export const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.staus(400).json({success: false, message: "no sich account"});

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({success:false, message: "incorrect password"});

        // JWT authorization

        const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({success: true, accessToken: accessToken});

    } catch (error) {
        console.log("failed to login user")
        res.status(500).json({success: false, message: "server login error"});
    }
}
