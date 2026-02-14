import { Box, Container, Grid, Link as MuiLink, Stack, Typography, } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { useCryptoAggregator } from '../actions/display.coin';
import { userAuth } from '../actions/user.auth';
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    // create socket connection
    autoConnect: false,
    // not connected cuz we need to attach accessToken insede ProfilePage
})

const ProfilePage = () => {

    const accessToken = userAuth((state) => state.accessToken);

    useEffect(() => {
        // attach accessToken and connect
        if (!accessToken) return;

        socket.auth = {token: accessToken}
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [accessToken]);

    const { favoriteData, setFavoriteData } = useCryptoAggregator();

//     CLIENT
//   emit("profile-event") ─────────▶ SERVER
//                                    |
//                                    | fetch data
//                                    ▼
//   CLIENT ◀──────── emit("profile-data")


    useEffect(() => {
        // socket listener
        socket.on("profile-data", (data) => {
            const normalized = Object.fromEntries(
                data.map((coin) => [coin._id, coin])
            );
            setFavoriteData(normalized);
        });

        return () => {
            socket.off("profile-data");
        };
    }, [setFavoriteData]);

    useEffect(() => {
        // talk once: server, give my data
        if (!socket.connected) {
            return;
        }
        socket.emit("profile-event");
    }, []);

    // const columns = useMemo(() => [
    //     { field: 'exchange', headerName: 'Exchange', width: 10 },
    //     { field: 'symbol', headerName: 'Symbol', width: 10 },
    //     { field: 'price', headerName: 'Price', type: 'number', width: 90, },
    //     { field: 'volume', headerName: 'Volume', type: 'number', width: 90, },
    //     { field: 'percent24h', headerName: '%24h', type: 'number', width: 90, },
    //     { field: 'percent1h', headerName: '%1h', type: 'number', width: 90, },
    //     { field: 'action', headerName: "action"} 
    // ]);

    // const rows = Object.values(coins).map(coin => ({ 
    //     exchange: coin.exchange,
    //     id: coin._id,
    //     symbol: coin.base_currency, 
    //     price: coin.price, 
    //     volume: coin.volume_24h, 
    //     percent24h: coin.percent_change_24h,
    //     percent1h: coin.percent_change_1h, 
    // }));

    return (
        <Container>
            <h3>Welcome</h3>
        </Container>
    );
}

export default ProfilePage;
