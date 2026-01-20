import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import coinRoutes from './routes/coin.route.js';
import { cronAggregate, cronMarketAndHistory } from './scripts/main.script.js';

dotenv.config({ path: "../../CryptoAggregator/.env" });
console.log('this is check: ', process.env.COIN_MARKET_CAP_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use("/crypto-aggregator", coinRoutes)

// await cronAggregate.start();
// await cronMarketAndHistory.start();

app.listen(PORT, () => {
    connectDB();
    console.log("server started at: http://localhost:" + PORT);
});
