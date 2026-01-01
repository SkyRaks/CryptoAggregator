import { createHash, createHmac } from 'crypto';
import dotenv from 'dotenv';
import { URLSearchParams } from 'url';

dotenv.config({ path: "../../.env" });
const privateKey = process.env.KRAKEN_PRIVATE_API_KEY;

// GET ticker: https://api.kraken.com/0/public/Ticker

main()

function main() {
    request({
        method: "GET",
        path: "/0/public/Ticker",
        environment: "https://api.kraken.com",
        query: {pair: "XBTUSD"},
    })
    .then((response) => response.text())
    .then(console.log)
}

function request({method = "GET", path = "", query = {}, body = {}, publicKey = "", privateKey = "", environment = ""}) {
    // this func takes OBJECT, like json file
    let url = environment + path;
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
    return fetch(url, {method: method, headers: headers, body: bodyString})
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
