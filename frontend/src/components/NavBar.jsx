import { AppBar, Box, Toolbar, Container, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";

export default function ButtonAppBar({ toggleTheme, mode }) {

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
        <Container maxWidth="md">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button 
                // color="inherit"
                // component={Link}
                // to="/"
                >
                Home
                </Button>
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

            <IconButton color="inherit" onClick={toggleTheme}>
                {mode === "light" ? (<MdDarkMode size="30px"/>) : (<MdOutlineLightMode size="30px"/>)}
            </IconButton>

            </Toolbar>
            </Container>
        </AppBar>
        </Box>
    );
}
