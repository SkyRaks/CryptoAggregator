import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import coinRoutes from './routes/aggregated.route.js';
// import { cronAggregate, cronMarketAndHistory } from './scripts/main.script.js';
import http from 'http';
import { Server } from 'socket.io';
import { getSocketData, getFavoriteSocketData } from "./socket-service.js";
import userRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken";;

dotenv.config({ path: "../../CryptoAggregator/.env" });

await connectDB();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use(cookieParser());

app.use("/crypto-aggregator", coinRoutes)
app.use("/user", userRoutes);

export const server = http.createServer(app); // socket will attach to this server

const io = new Server(server, { // instead of port is server
    cors: {
        origin: "*",
    }
})

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
    } catch (error) {
        console.error(error.message);
        socket.disconnect();
    }

    socket.on("home-event", async (exchange) => {
        // console.log(socket.user.id);
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

            socket.emit("profile-data", data);
        } catch (error) {
            socket.emit("profile-data", error.message);
            // console.log("profile event error");
        }
    })
})

// cronAggregate.start();
// cronMarketAndHistory.start();

server.listen(PORT, "0.0.0.0", () => {
    // connectDB();
    console.log("server started at: http://localhost:" + PORT);
});
