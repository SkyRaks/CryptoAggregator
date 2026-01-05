import { createHash, createHmac } from 'crypto';
import dotenv from 'dotenv';
import { URLSearchParams } from 'url';

dotenv.config({ path: "../../.env" });
const privateKey = process.env.KRAKEN_PRIVATE_API_KEY;

const ENVIRONMENT = "https://api.kraken.com";

// GET ticker: https://api.kraken.com/0/public/Ticker

main();

async function main() {
    const resp = await request({
        method: "GET",
        path: "/0/public/Ticker",
        // environment: ENVIRONMENT,
        query: {pair: "XXBTZUSD,XETHZUSD,USDTZUSD" },
        // XBTUSD, ETHUSD, USDTUSD, BNBUSD, XRPUSD, USDCUSD, SOLUSD, TRXUSD, DOGEUSD, ADAUSD
    })

    const data = resp['result'];
    const fields = await getFields(data);
    // const coin = data['XXBTZUSD'];
    // const price = coin['a'][0];

    console.log(fields);
}

async function getFields(data) {
    const marketModel = []
    let index = 0;
    for (const [pair, coin] of Object.entries(data)) {
        marketModel[index] = [];

        switch (pair) {
            case 'XXBTZUSD':
                marketModel[index].push("BTC");
                break;
            case 'XETHZUSD':
                marketModel[index].push("ETH");
                break;
            case 'USDTZUSD':
                marketModel[index].push("USDT");
                break;
        }

        marketModel[index].push("USD") // for now it is hardcoded

        const price = coin['a'][0];
        marketModel[index].push(price);

        const volume24h = coin['v'][1];
        marketModel[index].push(volume24h);

        // next will be percent change 24h
        const last_price = coin['c'][0];
        const opening_price = coin['o'];

        const percent_change_24h = ((last_price - opening_price) / opening_price) * 100;
        marketModel[index].push(percent_change_24h);

        // for 1h percent change we need to GET ohlc data
        const percent_change1h = await getOHLC(pair);
        marketModel[index].push(percent_change1h);

        index++;
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
    // we need 'close' 
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

// HMAC-SHA512 of (URI path + SHA256(nonce + POST data)) and base64 decoded secret API key
// ITS ALL IS NOT WORKING WITH MY REQUEST
// function getSignature(urlPath, data, secret) {
//     let encoded;
//     if (typeof data === 'string') {
//         const jsonData = JSON.parse(data);
//         encoded = jsonData.nonce + data;
//     } else if (typeof data === 'object') {
//         const dataStr = querystring.stringify(data);
//         encoded = data.nonce + dataStr;
//     } else {
//         throw new Error("Invalid data type");
//     }

//     const sha256Hash = crypto.createHash('sha256').update(encoded).digest();
//     const message = urlPath + sha256Hash.toString('binary'); // this is it: (URI path + SHA256(nonce + POST data)

//     const secretBuffer = Buffer.from(secret, 'base64'); // and base64 decoded secret API key

//     const hmac = crypto.createHmac('sha512', secretBuffer);
//     hmac.update(message, 'binary'); // this is ready

//     const signature = hmac.digest('base64');
//     return signature;
// }


// THIS IS TEST CASE STUFF
// let nonce = Date.now().toString();

// const payload = {
//     // this is query string, params, data...
//     "nonce": nonce,
//     "ordertype": "limit", 
//     "pair": "XBTUSD",
//     "price": 37500, 
//     "type": "buy",
//     "volume": 1.25
// }
// const mySignature = getSignature("/0/private/AddOrder", payload, secret_key);
// console.log(`API Sign ${mySignature}`);
