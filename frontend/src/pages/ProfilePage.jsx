import { Box, Container, Grid, Link as MuiLink, Stack, Typography, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { useCryptoAggregator } from '../actions/display.coin';
import { userAuth } from '../actions/user.auth';
import { io } from "socket.io-client";

// create socket connection
let profileSocket = io("http://localhost:5000", {autoConnect: false})

const ProfilePage = () => {

    const accessToken = userAuth((state) => state.accessToken);

    const { favoriteData, setFavoriteData } = userAuth(); // my full favorite data

    useEffect(() => {
        // attach accessToken and connect
        if (!accessToken) return;

        profileSocket = io("http://localhost:5000", {autoConnect: false});
        profileSocket.auth = {token: accessToken}

        const handleProfileData = (data) => {
            const normalized = Object.fromEntries(
                data.map((coin) => [coin._id, coin])
            );
            console.log(normalized);
            setFavoriteData(normalized);

            // if (!data || !Array.isArray(data)) return;
            // const normalized = Object.fromEntries(data.map((coin) => [coin._id, coin]));
            // setFavoriteData(normalized);
        }

        profileSocket.on("profile-data", handleProfileData);

        profileSocket.connect();
        profileSocket.emit("profile-event");

        return () => {
            profileSocket.disconnect();
            profileSocket.off("profile-data", handleProfileData);
    //         profileSocket.off("connect", emitProfileEvent);
        };
    }, [accessToken, setFavoriteData]);

// //     CLIENT
// //   emit("profile-event") ─────────▶ SERVER
// //                                    |
// //                                    | fetch data
// //                                    ▼
// //   CLIENT ◀──────── emit("profile-data")

    const columns = useMemo(() => [
        { field: 'exchange', headerName: 'Exchange', width: 10 },
        { field: 'symbol', headerName: 'Symbol', width: 10 },
        { field: 'price', headerName: 'Price', type: 'number', width: 90, },
        { field: 'volume', headerName: 'Volume', type: 'number', width: 90, },
        { field: 'percent24h', headerName: '%24h', type: 'number', width: 90, },
        { field: 'percent1h', headerName: '%1h', type: 'number', width: 90, },
        { field: 'action', headerName: "action"} 
    ], []);
    console.log(favoriteData);

    const rows = Object.values(favoriteData || {}).map(coin => ({ 
        id: coin._id,
        exchange: coin.exchange,
        symbol: coin.base_currency, 
        price: coin.price, 
        volume: coin.volume_24h, 
        percent24h: coin.percent_change_24h,
        percent1h: coin.percent_change_1h, 
    }));

    const paginationModel = { page: 0, pageSize: 5 };

    return (
        <Container>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    // pageSizeOptions={[5, 10]}
                    checkboxSelection
                    // sx={{ border: 0 }}
                />
            </Paper>
        </Container>
    );
}

export default ProfilePage;
