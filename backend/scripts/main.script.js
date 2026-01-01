import dotenv from 'dotenv';

dotenv.config({ path: "../../.env" });

const base_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
const api_key = process.env.COIN_MARKET_CAP_API_KEY;

getLatest();

async function getLatest() {
    const params = '?start=1&limit=15&convert=USD';

    try {
        const res = await fetch(base_url + params, {
            method: 'GET',
            headers: {
                "Content-Type": "Application/json",
                "X-CMC_PRO_API_KEY": api_key,
            }
        })

        if (!res.ok) {
            console.log(res.status);
        }

        const data = await res.json();
        const coinData = data['data'];

        const arr = []

        for (let coin = 0; coin < coinData.length; coin++) { // so this is how to get stuff
            arr[coin] = []
            const quote = coinData[coin]['quote']
            // arr[coin].push(coinData[coin]['id']);
            // arr[coin].push(coinData[coin]['name']);
            arr[coin].push(coinData[coin]['symbol']);
            arr[coin].push(quote);
        }
        console.log(arr[0]);
    } catch (error) {
        console.error(error);
    }
}
