import express from 'express';
import { getCoins, createCoins } from '../controllers/coin.controller.js';

const router = express.Router();

router.get("/", getCoins); // later it will get aggregated coins

router.post("/", createCoins); // i guess i will not be using it

export default router;
