import dotenv from 'dotenv';
import { getCoinMarketCapData } from './coinMarketCap.script.js';
import { main } from './kraken.script.js';

dotenv.config({ path: "../../.env" });

// now here i have to extract data from my scripts and aggregate it here somehow

const coinMarketCapData = await getCoinMarketCapData("USD");
const krakenData = await main();

console.log(typeof(coinMarketCapData));
console.log(typeof(krakenData));
