import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import coinRoutes from './routes/aggregated.route.js';
// import { cronAggregate, cronMarketAndHistory } from './scripts/main.script.js';
import http from 'http';
import { Server } from 'socket.io';
import { getSocketData } from "./socket-service.js";
import userRoutes from './routes/auth.route.js';

dotenv.config({ path: "../../CryptoAggregator/.env" });

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use("/crypto-aggregator", coinRoutes)
app.use("/user", userRoutes);

export const server = http.createServer(app); // socket will attach to this server

const io = new Server(server, { // instead of port is server
    cors: {
        origin: "*",
    }
})

io.on("connection", (socket) => {
    console.log("socket is running: ", socket.id);

    socket.on("custom-event", async (exchange) => {
        try {
            let data = await getSocketData(exchange);
            data = data.map(coin => ({
                ...coin.toObject(),
                _id: coin._id.toString()
            }))

            io.emit("display-data", data);   
        } catch (error) {
            throw error
        }
    })
})

// await cronAggregate.start();
// await cronMarketAndHistory.start();

server.listen(PORT, () => {
    connectDB();
    console.log("server started at: http://localhost:" + PORT);
});
