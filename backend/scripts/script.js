import dotenv from 'dotenv';

const dotBlya = dotenv.config({ path: "../../.env" });

const base_url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
const api_key = process.env.API_KEY;

getLatest();

async function getLatest() {
    const params = '?start=1&limit=10&convert=USD';

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
            // gotta do something better than loop
            const name = coinData[coin]['name']; 
            const symbol = coinData[coin]['symbol'];
            const slug = coinData[coin]['slug'];
            // console.log(name + " " + symbol + " " + slug);
            arr[coin] = []
            arr[coin].push(name);
            arr[coin].push(symbol);
            arr[coin].push(slug);
        }
        console.log(arr);
    } catch (error) {
        console.error(error);
    }
}
