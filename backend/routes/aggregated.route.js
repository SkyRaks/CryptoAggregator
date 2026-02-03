import express from 'express';
import { getExchangeData } from '../controllers/coin.controller.js';
import { authenticateToken } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/", authenticateToken, getExchangeData); // later it will get aggregated coins

// router.get("/kraken", getKrakenExchangeData);

export default router;
