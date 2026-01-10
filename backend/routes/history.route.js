import express from 'express';
import { createHistory } from '../controllers/history.controller.js';

const router = express.Router();

router.post('/', createHistory);

export default router;