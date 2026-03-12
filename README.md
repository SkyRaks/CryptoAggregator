# CryptoAggregator — MERN App

Full Stack crypto aggregator application. With custom JWT authorization and Alert System.\
Backend built with **Node**, **Express**, **MongoDB** and **Redis**.\
Frontend buikt with **React**, **MaterialUI**
fully containerized using **Docker Compose**.\

---

## Features

* Monitoring dynamic, real-time crypto data (Socket.IO + Redis)
* Ability to add favorite coins
* Ability to add phone number
* Custom SMS Alerts
* MongoDB database
* Dockerized development environment

---

## Tech Stack

* **Backend:** Node, Express
* **Realtime:** Socket.IO
* **Database:** MongoDB
* **Cache / Broker:** BullMQ
* **Containerization:** Docker & Docker Compose

---

## Requirements

You need:
*Docker
*Docker Compose
*MongoDB dababase
*CoinMaketCap account
*Kraken account
*Twilio account
https://id.kraken.com/sign-in
https://pro.coinmarketcap.com/account

---

## Getting Started (Docker Compose)

### 1. Clone the repository

### 2. Create .env file
Create .env file with same fields as in example, then replace with your own.\
### 2.1. For ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET you need:
Open terminal.\
Enter:
```bash
node
```
Run next command 2 times:
```bash
require('crypto').randomBytes(64).toString('hex')
```
And now you have ACCESS_TOKEN_SECRET as well as REFRESH_TOKEN_SECRET.\

### 3. Build and run the project.
```bash
docker compose up --build
```
To kill program press Ctrl+C.\
The app will be available at: 
```
http://localhost:4173/
```

---

## Services Overview

App runs with three containers:

| Service         | Description              | Port        |
| ----------------| ------------------------ | ----------- |
| crypto-backend  | Node, Express, Socket.io | 5000 → 5000 |
| crypto-frontend | React frontend           | 4173        |
| cryptoApp-redis | Redis for BullMQ         | 6379        |

---

## Startup Flow (Important for understanding the project)
When backend container starts, it connects to MongoDB.\
Then starts cron jobs for fetching data from excahnges.\
Aggregating data, fetching profile data, checking alerts.\ 

---

## Project Structure (simplified)

```
CryptoAggregator/
│
├── backend/
|   ├── config/
|   ├── controllers/
|   ├── models/
|   ├── queues/
|   ├── routes/
|   ├── scripts/
|   ├── workers/
|   ├── .dockerignore
|   ├── Dockerfile
|   ├── package-lock.json
|   ├── package.json
|   ├── server.js
|   └── socket-service.js
├── frontend/
|   ├── node_modules/
|   ├── public/
|   ├── src/
|   ├── .dockerignore
|   ├── .gitignore
|   ├── Dockerfile
|   ├── eslint.config.js
|   ├── index.html
|   ├── package-lock.json
|   ├── package.json
|   └── vite.config.js
├── node_modules/          
├── .env
├── .gitegnore
├── .dockerignore
├── docker-compose.yml
└── README.md
```

---

## Future Ideas

* Utilize History data
* Email way to send alerts

---

## Contributing

Pull requests are welcome:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Open a PR

---

If you find this project helpful, consider giving it a star⭐!
