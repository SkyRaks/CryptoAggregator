import express from 'express';
// import { getCoins, createCoins } from '../controllers/coin.controller.js';
import { getExchangeData } from '../controllers/coin.controller.js';

const router = express.Router();

router.post("/", getExchangeData); // later it will get aggregated coins

// router.get("/kraken", getKrakenExchangeData);

export default router;
