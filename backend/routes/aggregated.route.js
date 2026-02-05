import express from 'express';
import { getExchangeData, addFavorite } from '../controllers/coin.controller.js';
import { authenticateToken } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/", authenticateToken, getExchangeData); // later it will get aggregated coins

router.post("/add-favorite", authenticateToken, addFavorite);

export default router;
