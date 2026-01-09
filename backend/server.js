import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import coinRoutes from './routes/coin.route.js';
import marketRoutes from './routes/market.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use("/crypto-aggregator", coinRoutes)

app.use("/crypto-market", marketRoutes)

app.listen(PORT, () => {
    connectDB();
    console.log("server started at: http://localhost:" + PORT);
});
