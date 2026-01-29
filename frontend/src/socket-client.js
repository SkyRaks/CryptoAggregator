import { io } from "socket.io-client";
import dotenv from 'dotenv';

dotenv.config({ path: "../../CryptoAggregator/.env" });

const PORT = process.env.PORT || 5000

const socket = io(`http://localhost:${PORT}`)
