import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import coinRoutes from './routes/aggregated.route.js';
import {cronAggregate, cronMarket, cronProfile } from './scripts/main.script.js';
import http from 'http';
import { Server } from 'socket.io';
import { getSocketData, getFavoriteSocketData } from "./socket-service.js";
import userRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";
import { cronAlert } from './queues/alert.queue.js';
import {worker} from "./workers/alert.worker.js";

dotenv.config({ path: "../../CryptoAggregator/.env" });

await connectDB();

// feisty-inspiration-production-c46b.up.railway.app
const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_API_URL,
    credentials: true,
}))

app.use("/crypto-aggregator", coinRoutes)
app.use("/user", userRoutes);

export const server = http.createServer(app); // socket will attach to this server

export const io = new Server(server, { // instead of port is server
    cors: {
        origin: "*",
    }
})

export const profileSockets = new Map();

io.on("connection", (socket) => {
    // authenticate token for socket
    try {
        const accessToken = socket.handshake.auth.token;

        if (!accessToken) {
            socket.disconnect();
            return;
        }

        const user = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        socket.user = user;

        profileSockets.set(socket.user.id, socket);

        socket.on("disconnect", () => {
            profileSockets.delete(socket.user.id);
        });
    } catch (error) {
        console.error(error.message);
        socket.disconnect();
    }

    socket.on("home-event", async (exchange) => {
        try {
            let data = await getSocketData(exchange);

            data = data.map(coin => ({
                ...coin.toObject(),
                _id: coin._id.toString()
            }))

            socket.emit("display-data", data);   
        } catch (error) {
            throw error
        }
    })

    socket.on("profile-event", async () => {
        try {
            const userId = socket.user.id

            let data = await getFavoriteSocketData(userId);

            const payload = data.map(coin => ({
                ...coin.toObject(),
                _id: coin._id.toString()
            }));

            socket.emit("profile-data", payload);
        } catch (error) {
            socket.emit("profile-data", error.message);
        }
    })
})

cronAggregate.start();
cronMarket.start();
// cronHistory.start();
cronProfile.start();

cronAlert.start();

server.listen(PORT, "0.0.0.0", () => {
    console.log("server started at: http://localhost:" + PORT);
});
