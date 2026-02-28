import { Box, Container, Grid, Link as MuiLink, TextField, Paper, Dialog, DialogTitle, DialogActions, DialogContent, Button, ButtonGroup } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link } from "react-router-dom";
import { useCryptoAggregator } from '../actions/display.coin';
import { userAuth } from '../actions/user.auth';
import { io } from "socket.io-client";
import parsePhoneNumber from 'libphonenumber-js'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// create socket connection
let profileSocket = io("http://localhost:5000", {autoConnect: false})

const ProfilePage = () => {

    const accessToken = userAuth((state) => state.accessToken);

    // gotta always use selector for this \  /
    //                                     \/
    const user = userAuth((state) => state.user);
    const favoriteData = userAuth((state) => state.favoriteData);
    const setFavoriteData = userAuth((state) => state.setFavoriteData);
    // oliver123123@mail.com
    // idinahui123

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
        }

        profileSocket.on("profile-data", handleProfileData);

        profileSocket.connect();
        profileSocket.emit("profile-event");

        return () => {
            profileSocket.disconnect();
            profileSocket.off("profile-data", handleProfileData);
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

    // window
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }       
    // 

    const [phone, setPhone] = useState("");
    const [error, setError] = useState(false);

    const {addPhoneNumber} = userAuth();

    // const handleChange = (e) => {
    //     const v = e.target.value;
    //     setPhone(v);

    //     const num = parsePhoneNumber(v, "CA");
    //     const check = num ? num.isValid() : false

    //     setError(!check);
    // };

    const handleChange = (e) => {
        const v = e.target.value;
        setPhone(v);

        const isValid = parsePhoneNumber(v, "CA")?.isValid() ?? false;
        setError(!isValid);
    };

    const handleConfirm = () => {
        if (error || !phone) return
        // let normalized = phone.startsWith("+") ? phone : "+" + phone;
        addPhoneNumber(phone.toString());
        handleClose();
    };

    return (
        // <Box
        //     sx={{mt: 3}}
        // >
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Add your phone number"}
                </DialogTitle>

                <DialogContent>
                    <TextField 
                        label="Phone Number"
                        value={phone}
                        onChange={handleChange}
                        error={error}
                        helperText={error ? "Invalid phone number" : ""}
                        placeholder="123 456 7890"
                        fullWidth
                        slotProps={{
                            htmlInput: {
                                maxLength: 10,
                            }
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleConfirm}>Confirm</Button>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>

            </Dialog>

            <Container sx={{mt: 3}}>

                {!user.phoneNumber ? (
                    <span
                        onClick={handleOpen}
                        style={{cursor: "pointer"}}
                    >
                        <h3>no number</h3>
                    </span>
                ) : null}

                <Box sx={{display: "flex", gap: 2}}>

                    <Box sx={{width: "75%"}}>
                        <Paper sx={{ height: 400, width: '100%'}}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{ pagination: { paginationModel } }}
                                checkboxSelection
                            />
                        </Paper>
                    </Box>


                    <Box 
                        sx={{width: "25%",
                            height: 350,
                            border: '1px solid',
                            borderWidth: 2,
                            borderRadius: 2,
                            // #ffee33
                        }}
                        textAlign="center"
                        >
                            <h2>Create an Alert</h2>
                            <h4>Notify me when:</h4>
                            <ButtonGroup
                                sx={{margin: "15px"}}
                                color='favorite'
                                variant="contained"
                                // ref={anchorRef}
                                aria-label="Button group with a nested menu"
                            >
                                <Button>BTC</Button>
                                <Button
                                size="small"
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                // onClick={}
                                >
                                <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>

                            is

                            <ButtonGroup
                                sx={{margin: "15px"}}
                                color='favorite'
                                variant="contained"
                                // ref={anchorRef}
                                aria-label="Button group with a nested menu"
                            >
                                <Button>{'>'}</Button>
                                <Button
                                size="small"
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                // onClick={}
                                >
                                <ArrowDropDownIcon />
                                </Button>
                            </ButtonGroup>

                            than
                            <br/>

                            <TextField
                            label="Enter your amount"
                            type="number"
                            // onChange={(e) =>
                            //     setUser({ ...user, email: e.target.value })
                            // }
                            />

                            <Button 
                                sx={{margin: "15px"}}
                                color='favorite'
                                variant="contained"
                            >
                                Create Alert
                            </Button>
                    </Box>

                </Box>

            </Container>
        </Fragment>
        // </Box>
    );
}

export default ProfilePage;
