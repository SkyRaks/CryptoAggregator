import { Box, Container, Grid, Link as MuiLink, TextField, Paper, Dialog, DialogTitle, DialogActions, DialogContent, Button, ButtonGroup, Menu, MenuItem, IconButton, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Fragment, useEffect, useMemo, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { useCryptoAggregator } from '../actions/display.coin';
import { userAuth } from '../actions/user.auth';
import { io } from "socket.io-client";
import parsePhoneNumber from 'libphonenumber-js'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { MdDelete } from "react-icons/md";

// create socket connection
let profileSocket = io("http://localhost:5000", {autoConnect: false})

const ProfilePage = () => {

    // snack bar pop ups
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const accessToken = userAuth((state) => state.accessToken);

    // gotta always use selector for this \  /
    //                                     \/
    const user = userAuth((state) => state.user);
    const favoriteData = userAuth((state) => state.favoriteData);
    const setFavoriteData = userAuth((state) => state.setFavoriteData);
    // oliver123123@mail.com
    // idinahui123

    const {addPhoneNumber, deletePhoneNumber} = userAuth();
    const {createAlert} = useCryptoAggregator();

    // for alert window
    const coinOptions = useMemo(() => {
        return Object.values(favoriteData).map(item => ({
            symbol: item.base_currency,
            exchange: !item.exchange ? "aggregated" : item.exchange,
            coinId: item._id,
        }
    ))});
    const [selectedCoin, setSelectedCoin] = useState(null);

    const signOptions = [">", "<", ">=", "<="]
    const [selectedOption, setSelectedOption] = useState(0);

    const [amount, setAmount] = useState(null);

    useEffect(() => {
        // automatically sets selected coin to index 0 if there is at all
        if (coinOptions.length && selectedCoin === null) {
            setSelectedCoin(0);
        }
    }, [selectedCoin, setSelectedCoin]);

    // alert system buttons
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };
    const handleClose = () => {
        setOpen(false);
    }
    // 

    const handleMenuItem = (index) => {
        // when click on item select it and close
        setSelectedCoin(index);
        setOpen(false);
    };

    const handleAlert = async () => {
        // make a lot of checks if no fields
        // const favoriteCoinId = coinOptions[selectedCoin].coinId;
        const favCoinSymbol = coinOptions[selectedCoin].symbol;
        const favCoinExchange = coinOptions[selectedCoin].exchange;

        const sign = signOptions[selectedOption];

        const {success} = await createAlert({favCoinSymbol, favCoinExchange, amount, sign});

        if (success == true) {
            console.log("it worked");
        } else {
            console.log("bruh");
        }
        // next pop snackbar that all's good or not
    }

    useEffect(() => {
        // attach accessToken and connect
        if (!accessToken) return;

        profileSocket = io("http://localhost:5000", {autoConnect: false});
        profileSocket.auth = {token: accessToken}

        const handleProfileData = (data) => {
            const normalized = Object.fromEntries(
                data.map((coin) => [coin._id, coin])
            );
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


    const rows = useMemo(() => {
        return Object.values(favoriteData || {}).map(coin => ({ 
            id: coin._id,
            exchange: !coin.exchange ? "Aggregated" : coin.exchange,
            symbol: coin.base_currency, 
            price: coin.price, 
            volume: coin.volume_24h, 
            percent24h: coin.percent_change_24h,
            percent1h: coin.percent_change_1h, 
    }))}, [favoriteData]);

    const paginationModel = { page: 0, pageSize: 5 };

    // window
    const [openWindow, setOpenWindow] = useState(false);
    const handleOpenWindow = () => {
        setOpenWindow(true);
    }
    const handleCloseWindow = () => {
        setOpenWindow(false);
    }       
    // 

    const [phone, setPhone] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const v = e.target.value;
        setPhone(v);

        const isValid = parsePhoneNumber(v, "CA")?.isValid() ?? false;
        setError(!isValid);
    };

    const handleConfirm = async () => {
        if (error || !phone) return
        // let normalized = phone.startsWith("+") ? phone : "+" + phone;
        const {success, message} = await addPhoneNumber(phone.toString());

        if (success == true) user.phoneNumber = phone;
        setSnackbar({ open:true, message:message, severity:success ? "success" : "error", });
        handleCloseWindow();
    };

    // delete phone number stuff
    const [openDeletePhone, setOpenDeletePhone] = useState(false);

    const handleOpenDeletePhone = () => {
        setOpenDeletePhone(true);
    }
    const handleCloseDeletePhone = () => {
        setOpenDeletePhone(false);
    }

    const handleDeletePhone = async () => {
        const {success, message} = await deletePhoneNumber();

        if (success == true) user.phoneNumber = null
        setSnackbar({ open:true, message:message, severity:success ? "success" : "error", });
        handleCloseDeletePhone();
    }

    return (
        <Fragment>
            {/* delete phone number dialog */}
            <Dialog
                open={openDeletePhone}
                onClose={handleCloseDeletePhone}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete phone Number?"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleDeletePhone}>Yes</Button>
                    <Button onClick={handleCloseDeletePhone}>No</Button>
                </DialogActions>
            </Dialog>

            {/* add phone number dialog */}
            <Dialog
                open={openWindow}
                onClose={handleCloseWindow}
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
                    <Button onClick={handleCloseWindow}>Cancel</Button>
                </DialogActions>

            </Dialog>

            <Container sx={{mt: 3}}>
                {/* user's info box */}
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}>
                    <Box>
                        <h2 style={{marginLeft: "50px"}}>Welcome {user.name}</h2>
                    </Box>

                    {user.phoneNumber ? (
                        <Box>
                            Phone number is: {"+1"}{user.phoneNumber} 
                            <IconButton style={{marginRight: "50px"}}>
                                <MdDelete onClick={handleOpenDeletePhone}/>
                            </IconButton>
                        </Box>
                    ): null}
                </Box>

                {!user.phoneNumber ? (
                    <span
                        onClick={handleOpenWindow}
                        style={{cursor: "pointer"}}
                    >
                        <h3>You don't have a phone number, add it to create custom Notifications
                        </h3>
                    </span>
                ) : null}

                {/* coin table and alert system box */}
                <Box sx={{display: "flex", justifyContent: "center", gap: 2}}>
                    <Box sx={{width: !user.phoneNumber ? "100%" : "60%"}}>
                        <Paper sx={{ height: 400, width: '100%'}}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{ pagination: { paginationModel } }}
                                disableRowSelectionOnClick
                            />
                        </Paper>
                    </Box>

                    {/* alert system box */}
                    {user.phoneNumber ? (
                        <Box 
                            sx={{width: "25%",
                                height: 400,
                                border: '1px solid',
                                borderWidth: 2,
                                borderRadius: 2,
                            }}
                            textAlign="center"
                            >
                                <h2>Create an Alert</h2>
                                    Notify me when:
                                <br />

                                <Box ref={anchorRef} sx={{display: "inline-flex"}}>

                                    <ButtonGroup // coin symbol
                                        sx={{margin: "15px"}}
                                        color='favorite'
                                        variant="contained"
                                        aria-label="Button group with a nested menu"
                                    >
                                        <Button disabled={!coinOptions.length}>
                                            {coinOptions[selectedCoin]?.symbol ?? "Select Item"}
                                        </Button>
                                        <Button size="small" onClick={handleToggle}>
                                            <ArrowDropDownIcon />
                                        </Button>
                                    </ButtonGroup>

                                </Box>

                                <Menu // for coin symbol
                                    anchorEl={anchorRef.current}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                                    transformOrigin={{vertical: "top", horizontal: "left"}}
                                >
                                    {coinOptions.map((option, index) => (
                                        <MenuItem 
                                            key={option.symbol}
                                            selected={index === selectedCoin} 
                                            onClick={() => handleMenuItem(index)}
                                        >
                                            {option.symbol} {option.exchange}
                                        </MenuItem>
                                    ))}
                                </Menu>
                                    is

                                <ButtonGroup // sign
                                    sx={{margin: "15px"}}
                                    color='favorite'
                                    variant="contained"
                                > 
                                <Button
                                    onClick={() =>
                                        setSelectedOption(
                                            // selectedOption === null ? 0 : (selectedOption + 1) % signOptions.length
                                            (prev) => (prev + 1) % signOptions.length
                                        )
                                    }
                                >
                                    { selectedOption === null ? ">" : signOptions[selectedOption]}
                                </Button>

                                </ButtonGroup>

                                    than
                                    <br/>

                                <TextField
                                    label="Enter your amount"
                                    type="number"
                                    sx={{margin: "10px"}}
                                    inputProps={{ // prevents from typing '-' or 'e'
                                        min: 0,
                                        onKeyDown: (e) => {
                                            if (e.key === "-" || e.key === "e") e.preventDefault();
                                        },
                                    }}
                                    onChange={(e) =>
                                        setAmount(Number(e.target.value))
                                    }
                                />

                                <Button 
                                    sx={{margin: "10px"}}
                                    color='favorite'
                                    variant="contained"
                                    onClick={handleAlert}
                                >
                                    Create Alert
                                </Button>
                        </Box>
                    ) : null}

                </Box>

                <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
                </Snackbar>

            </Container>
        </Fragment>
    );
}

export default ProfilePage;
