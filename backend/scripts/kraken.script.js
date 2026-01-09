import { createHash, createHmac } from 'crypto';
import dotenv from 'dotenv';
import { URLSearchParams } from 'url';

dotenv.config({ path: "../../.env" });
const privateKey = process.env.KRAKEN_PRIVATE_API_KEY;

const ENVIRONMENT = "https://api.kraken.com";

const coinNames = {
    "XXBTZUSD": "BTC",
    "XETHZUSD": "ETH",
    "USDTZUSD": "USDT",
    "BNBUSD": "BNB",
    "XXRPZUSD": "XRP",
    "USDCUSD": "USDC",
    "SOLUSD": "SOL",
    "TRXUSD": "TRX",
    "XDGUSD": "DOGE",
    "ADAUSD": "ADA",
}

// console.log(await main());

// GET ticker: https://api.kraken.com/0/public/Ticker

export async function main() {
    const resp = await request({
        method: "GET",
        path: "/0/public/Ticker",
        query: {pair: "XXBTZUSD,XETHZUSD,USDTZUSD,BNBUSD,USDCUSD,XXRPZUSD,SOLUSD,TRXUSD,DOGEUSD,ADAUSD" },
    })

    const data = resp['result'];

    return await getFields(data);
}

async function getFields(data) {
    const marketModel = {}

    for (const [pair, coin] of Object.entries(data)) {
        let name = coinNames[pair]
        marketModel[name] = {}

        marketModel[name]['quote_currency'] = "USD" // for now it is hardcoded

        const price = Number(coin['a'][0]);
        marketModel[name]['price'] = price;

        const volume24h = Number(coin['v'][1]);
        marketModel[name]['volume_24h'] = volume24h;

        // next will be percent change 24h
        const last_price = coin['c'][0];
        const opening_price = coin['o'];

        const percent_change_24h = ((last_price - opening_price) / opening_price) * 100;
        marketModel[name]['percent_change_24h'] = percent_change_24h;

        // for 1h percent change we need to GET ohlc data
        const percent_change1h = await getOHLC(pair);
        marketModel[name]['percent_change_1h'] = percent_change1h;

        marketModel[name]['market'] = "kraken";
    }

    return marketModel;
}

async function getOHLC(pair) {
    const resp = await request({
        method: "GET",
        path: "/0/public/OHLC",
        query: {
            pair: pair,
            interval: 60,
        }
    })

    const data = resp['result'][pair];

    const current_close = Number(data[data.length - 1][4]);
    const previous_close = Number(data[data.length - 2][4]);

    const percent_change1h = ((current_close - previous_close) / previous_close) * 100;

    return percent_change1h;
}

async function request({method = "GET", path = "", query = {}, body = {}, publicKey = "", privateKey = ""}) {
    // this func takes OBJECT, like json file
    let url = ENVIRONMENT + path;
    let queryString = "";

    if (Object.keys(query).length > 0) {
        queryString = mapToURLValues(query).toString(); // and this also takes object
        url += "?" + queryString;
        // it becomes: https://futures.kraken.com/derivatives/api/v3/tickers?key1=val1&key2=val2...
    }

    let nonce = "";

    if (publicKey.length > 0) {
        nonce = body['nonce'];
        if (!nonce) {
            nonce = Date.now().toString();
            body['nonce'] = nonce
        }
    }

    const headers = {};
    let bodyString = null;

    if (Object.keys(body).length > 0) {
        bodyString = mapToURLValues(body).toString();
        headers["Content-Type"] = "application/json";
    }

    if (publicKey.length > 0) {
        headers["API-Key"] = publicKey;
        headers["Api-Sign"] = getSignature(privateKey, queryString + (bodyString || ""), nonce, path)
    }
    const res = await fetch(url, {method: method, headers: headers, body: bodyString})

    return await res.json()
}

function getSignature(privateKey = "", data = "", nonce = "", path = "") {
    return sign({
        privateKey: privateKey,
        message: path + createHash('sha256').update(nonce + data).digest('binary')
    })
}

function sign({ privateKey = "", message = "" }) {
    return createHmac(
        'sha512',
        Buffer.from(privateKey, 'base64')
    )
    .update(message, 'binary')
    .digest("base64")
}

function mapToURLValues(object) {
    return new URLSearchParams(Object.entries(object).map(([k, v]) => {
        if (typeof v == 'object') {
            v = JSON.stringify(v);
        }
        return [k, v]
    }))
}
