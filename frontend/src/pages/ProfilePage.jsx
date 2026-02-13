import { Box, Container, Grid, Link as MuiLink, Stack, Typography, } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { Link } from "react-router-dom";
import { useCryptoAggregator } from '../actions/display.coin';
import { userAuth } from '../actions/user.auth';

const ProfilePage = () => {

    const accessToken = ((state) => (state.accessToken));

    const { favoriteData, setFavoriteData } = useCryptoAggregator();

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
            <h3>something</h3>
        </Container>
    );
}

export default ProfilePage;
