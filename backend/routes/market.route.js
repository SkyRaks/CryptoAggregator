import express from 'express';
import { createMarketCoin } from '../controllers/market.controller.js';

const router = express.Router();

router.post('/', createMarketCoin);

export default router;
