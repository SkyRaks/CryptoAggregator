import { AppBar, Box, Toolbar, Container, Typography, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { userAuth } from '../actions/user.auth';
import { MdLogout } from "react-icons/md";
import { useState } from 'react';
import { Fragment } from 'react';

export default function ButtonAppBar({ toggleTheme, mode }) {
    const accessToken = userAuth((state) => state.accessToken);

    const setAccessToken = userAuth((state) => state.setAccessToken);

    // logout alert dialog
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleLogout = async () => {
        try {
            const res = await fetch("/user/logout", {
                method: "DELETE",
                credentials: "include",
            })
            if (!res.ok) {
                console.log("failer to log out", res.status);
            }

            setAccessToken(null);
            console.log("you've been logged out")
        } catch (error) {
            console.error(error.message);
        }
        setOpen(false);
    }

    return (
        <Fragment>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to logout?"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleLogout}>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
            <Container maxWidth="md">
                <Toolbar>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <IconButton 
                        color="inherit"
                        component={Link}
                        to="/"
                        >
                        <FaHome size="30px"/>
                    </IconButton>
                </Typography>

                {accessToken !== null ? (
                    <Fragment>
                        <IconButton 
                        // change it to link to profile page later
                            color='inherit'
                            component={Link}
                            to="/profile"
                            >
                            <IoPersonCircle size="30px"/>
                        </IconButton>

                        <IconButton
                            color='inherit'
                            onClick={handleOpen}
                            >
                            <MdLogout />
                        </IconButton>

                    </Fragment>
                ): null}

                <IconButton color="inherit" onClick={toggleTheme}>
                    {mode === "light" ? (<MdDarkMode size="30px"/>) : (<MdOutlineLightMode size="30px"/>)}
                </IconButton>

                </Toolbar>
                </Container>
            </AppBar>
            </Box>

        </Fragment>
    );
}
