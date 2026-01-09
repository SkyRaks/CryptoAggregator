import Market from "../models/market.model.js";

export const createMarketCoin = async (req, res) => {
    const marketData = req.body;

    for (const [symbol, data] of Object.entries(marketData)) {
        //quote currency
        const price = data['price']; // this is for testing
        console.log(price);
    }
} 

// test:

// {
//   ADA: {
//     quote_currency: 'USD',
//     price: 0.395747,
//     volume_24h: 12486481.4192368,
//     percent_change_24h: -0.015415602105628019,
//     percent_change_1h: 0.04045696137877159,
//     market: 'kraken'
//   },
// }
//   BNB: {
//     quote_currency: 'USD',
//     price: 892.14,
//     volume_24h: 1319.20085,
//     percent_change_24h: 0.058320809313382585,
//     percent_change_1h: 0.06056527590847506,
//     market: 'kraken'
//   },
//   ETH: {
//     quote_currency: 'USD',
//     price: 3107.82,
//     volume_24h: 20966.61202968,
//     percent_change_24h: 0.12855085491152018,
//     percent_change_1h: 0.130486472902315,
//     market: 'kraken'
//   },
//   SOL: {
//     quote_currency: 'USD',
//     price: 138.36,
//     volume_24h: 342615.05321023,
//     percent_change_24h: 0.07232749891510397,
//     percent_change_1h: 0.07232749891510397,
//     market: 'kraken'
//   },
//   TRX: {
//     quote_currency: 'USD',
//     price: 0.294646,
//     volume_24h: 4428849.50478985,
//     percent_change_24h: 0.012898495628101752,
//     percent_change_1h: 0.0016969803930996555,
//     market: 'kraken'
//   },
//   USDC: {
//     quote_currency: 'USD',
//     price: 0.9998,
//     volume_24h: 86565736.35917857,
//     percent_change_24h: -0.010002000400078915,
//     percent_change_1h: 0.010003000900268979,
//     market: 'kraken'
//   },
//   USDT: {
//     quote_currency: 'USD',
//     price: 0.99908,
//     volume_24h: 176598873.4422992,
//     percent_change_24h: 0,
//     percent_change_1h: 0.0020018817688647332,
//     market: 'kraken'
//   },
//   BTC: {
//     quote_currency: 'USD',
//     price: 91041.8,
//     volume_24h: 1416.62676096,
//     percent_change_24h: 0.013951582515917535,
//     percent_change_1h: 0.013951582515917535,
//     market: 'kraken'
//   },
//   DOGE: {
//     quote_currency: 'USD',
//     price: 0.1418939,
//     volume_24h: 75129185.64836022,
//     percent_change_24h: 0.060704895945043816,
//     percent_change_1h: 0.0644440746705309,
//     market: 'kraken'
//   },
//   XRP: {
//     quote_currency: 'USD',
//     price: 2.12071,
//     volume_24h: 31326081.5080028,
//     percent_change_24h: -0.02828454249754292,
//     percent_change_1h: -0.056092123063280507,
//     market: 'kraken'
//   }
// }
