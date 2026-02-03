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
        if (!user) return res.status(400).json({success: false, message: "no such account"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({success:false, message: "incorrect password"});

        // JWT authorization

        const accessToken = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
            }, process.env.ACCESS_TOKEN_SECRET);

        res.status(200).json({success: true, accessToken: accessToken});

    } catch (error) {
        console.log("failed to login user")
        res.status(500).json({success: false, message: "server login error"});
    }
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({success: false, message: "no token"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({success: false, message: "token no longer valid"});

        console.log("decoded: ", user);
        req.user = user;
        next();
    })
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2U1NDc5NGE0MWU0M2VlZWM3M2RlYSIsIm5hbWUiOiJvbGl2ZXIiLCJlbWFpbCI6Im9saXZlcjEyM0BtYWlsLmNvbSIsImlhdCI6MTc3MDA3OTAxMH0.8IuGRt8by2F8ap-bBIgTBW-dyq89f8YAT1ys8uO1XIg
