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
        if (res.status(201)) {
            console.log("user registered");
        }
    } catch (error) {
        console.log("failed to register user")
        res.status(500).json({success: false, message: "server register error"});
    }
};

export const login = async(req, res) => {
    // by logging we create access token with will expire and refresh token that will not
    // and when we logout we delete refresh token
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(400).json({success: false, message: "no such account"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({success:false, message: "incorrect password"});

        // JWT authorization

        const authUser = { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber}

        const accessToken = generateAccessToken(authUser);

        const refreshToken = generateRefreshToken(authUser);
        user.refreshTokens.push(refreshToken);
        await user.save(); // save refresh token to DB

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, 
            secure: false,
            sameSite: "strict",
            path: "/user",
        });

        // const favoriteCoins = user.favorites;

        res.status(200).json({success: true, accessToken: accessToken, 
            user: authUser,
            favoriteCoins: user.favorites,
        });

    } catch (error) {
        console.log("failed to login user")
        res.status(500).json({success: false, message: "server login error"});
    }
}

export const logout = async(req, res) => {
    try {
        // this deleted refresh token
        const token = req.cookies.refreshToken

        if (!token) return res.status(401).json({success: false, message: "no refreshToken"});

        const user = await User.findOne({refreshTokens: token});

        if (!user) return res.status(404).json({success: false, message: "user not found"});
        
        user.refreshTokens = user.refreshTokens.filter(refreshToken => refreshToken !== token)

        res.cookie("refreshToken", "", {
            httpOnly: true, 
            secure: false,
            sameSite: "strict",
            path: "/user",
            expires: new Date(0),
        })

        await user.save();
        res.status(200).json({success: true, message: "refresh token deleted"});
    } catch (error) {
        res.status(500).json({suceess: false, message: error.message});
    }
}

export const addNumber = async(req, res) => {
    const userId = req.user.id
    const {phone} = req.body

    try {
        const user = await User.findById(userId);

        if (user.phoneNumber) return res.status(409).json({success: false, message: "phone number already exists"});

        try {
            user.phoneNumber = phone;

            await user.save();
            res.status(201).json({success: true, message: "phone number added"});   
        } catch (error) {
            console.error("failed to save", error.message);
        }
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

export const deleteNumber = async(req, res) => {
    const userId = req.user.id

    try {
        const user = await User.findById(userId);

        if (!user.phoneNumber) return res.status(409).json({success: false, message: "You don't have a phone number"});

        try {
            user.phoneNumber = null;

            await user.save();
            res.status(200).json({suceess: true, message: "Phone number deleted"})
        } catch (error) {
            console.error("failed to delete", error. message);
        }
        
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}

export const refresh = async (req, res) => {
    try {
        const token = req.cookies.refreshToken

        if (!token) return res.status(401).json({success: false, message: "no token"});

        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(payload.id);
        if (!user) return res.status(403).json({success: false, message: "no such user"});

        if (!user.refreshTokens.includes(token)) return res.status(403).json({success: false, message: "refresh token revoked"});

        const newAccessToken = generateAccessToken(
            { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
            });

        const favoriteCoins = user.favorites;

        const refreshUser = {id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber}

        res.status(201).json({success: true, accessToken: newAccessToken, user: refreshUser, favoriteCoins: favoriteCoins});
    } catch (error) {
        res.status(403).json({success: false, message: "invalid refresh token"});
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
}

function generateRefreshToken(user) {
    return jwt.sign({id: user.id}, process.env.REFRESH_TOKEN_SECRET); // for now without expiration
}

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({success: false, message: "no token"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({success: false, message: "token no longer valid"});
        
        req.user = user;
        next();
    })
};
