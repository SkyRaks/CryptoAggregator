import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import coinRoutes from './routes/aggregated.route.js';
// import { cronAggregate, cronMarketAndHistory } from './scripts/main.script.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config({ path: "../../CryptoAggregator/.env" });

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use("/crypto-aggregator", coinRoutes)

export const server = http.createServer(app); // socket will attach to this server

const io = new Server(server, { // instead of port is server
    cors: {
        origin: "*",
    }
})

io.on("connection", (socket) => {
    console.log("socket is running: ", socket.id);
})

// await cronAggregate.start();
// await cronMarketAndHistory.start();

server.listen(PORT, () => {
    connectDB();
    console.log("server started at: http://localhost:" + PORT);
});
