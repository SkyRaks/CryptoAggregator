import express from 'express';
import { getCoins, createCoins } from '../controllers/coin.controller.js';

const router = express.Router();

router.get("/", getCoins);

router.post("/", createCoins);

export default router;
