import express from 'express';
import { register, login, refresh, logout, addNumber, deleteNumber } from '../controllers/user.controller.js';
import { authenticateToken } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/refresh", refresh);

router.delete("/logout", logout);

router.post("/add-phone-number", authenticateToken, addNumber);

router.post("/delete-phone-number", authenticateToken, deleteNumber);

export default router;
