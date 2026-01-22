import express from 'express';
// import { getCoins, createCoins } from '../controllers/coin.controller.js';
import { getAggregatedData } from '../controllers/coin.controller.js';

const router = express.Router();

router.get("/", getAggregatedData); // later it will get aggregated coins

export default router;
