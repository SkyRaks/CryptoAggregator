import { AppBar, Box, Toolbar, Container, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { Link } from 'react-router-dom';

export default function ButtonAppBar({ toggleTheme, mode }) {

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
        <Container maxWidth="md">
            <Toolbar>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {/* <Button 
                color="inherit"
                // component={Link}
                // to="/"
                >
                Home
                </Button> */}
                <IconButton 
                    color="inherit"
                    component={Link}
                    to="/"
                    >
                    <FaHome size="30px"/>
                </IconButton>
            </Typography>

            {/* {user !== null ?           
            (
                <>
                <IconButton 
                color="inherit"
                component={Link}
                to="/create"
                >
                    <CiSquarePlus size="30px"/>
                </IconButton>

                <IconButton
                    color="inherit"
                    onClick={logout}
                >
                    <IoIosLogIn />
                </IconButton>
                </>
            ) : (
                <IconButton 
                color="inherit"
                component={Link}
                to="/signup"
                >
                <IoPersonCircle size="30px"/>
                </IconButton>
            )} */}

            <IconButton 
                color='inherit'
                component={Link}
                to="/signup"
                >
                <IoPersonCircle size="30px"/>
            </IconButton>

            <IconButton color="inherit" onClick={toggleTheme}>
                {mode === "light" ? (<MdDarkMode size="30px"/>) : (<MdOutlineLightMode size="30px"/>)}
            </IconButton>

            </Toolbar>
            </Container>
        </AppBar>
        </Box>
    );
}
