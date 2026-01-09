import express from 'express';
import { createMarketCoin } from '../controllers/market.controller.js';

const router = express.Router();

router.get('/', createMarketCoin);

export default router;
