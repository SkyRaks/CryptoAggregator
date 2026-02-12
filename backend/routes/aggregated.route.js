import express from 'express';
import { getExchangeData, addFavorite, removeFavorite } from '../controllers/coin.controller.js';
import { authenticateToken } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/", authenticateToken, getExchangeData); // later it will get aggregated coins

router.post("/add-favorite", authenticateToken, addFavorite);

router.delete("/remove-favorite", authenticateToken, removeFavorite);

export default router;
