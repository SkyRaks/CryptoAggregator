import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useCryptoAggregator } from "../actions/display.coin";
import { useEffect, useState, Fragment, useRef, useMemo } from 'react';
import {Link} from "react-router-dom";

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IoIosAddCircle } from "react-icons/io";
import { IoIosRemoveCircle } from "react-icons/io";
import Typography from '@mui/material/Typography';
import {IconButton, Link as MuiLink} from "@mui/material";
import { Box } from "@mui/material";

import { io } from "socket.io-client";
import Container from '@mui/material/Container';
import { userAuth } from '../actions/user.auth';
import { API_URL } from '../api';

const socket = io(API_URL || "http://localhost:5000", {autoConnect: false}) // create socket connection

const paginationModel = { page: 0, pageSize: 5 };

const exchangeOptions = ['CoinMarketCap', 'Aggregated', 'Kraken'];  

const HomePage = () => {

  const accessToken = userAuth((state) => state.accessToken); 

  const favoriteCoins = userAuth((state) => state.favoriteCoins);
  const setFavoriteCoins = userAuth((state) => state.setFavoriteCoins);

  const addFavoriteLocal = userAuth((state) => state.addFavoriteLocal);
  const removeFavoriteLocal = userAuth((state) => state.removeFavoriteLocal);

  const { addFavorite, removeFavorite } = useCryptoAggregator();

  const handleAddFavorite = (symbol) => {
    const exchange = exchangeOptions[selectedIndex].toLowerCase();

    if (!symbol || !exchange) console.log("empty fields");
    addFavorite(symbol, exchange);
  }

  const handleRemoveFavorite = (symbol) => {
    const exchange = exchangeOptions[selectedIndex].toLowerCase();

    if (!symbol || !exchange) console.log("empty fields");
    removeFavorite(symbol, exchange);
  }

  // realtime update buttons
  const handleToggleFavorite = (symbol) => {
    const exchange = exchangeOptions[selectedIndex].toLowerCase();
    const isFav = favoriteCoins.some(
      (item) => item.symbol === symbol && item.exchange === exchange
    );

    if (isFav) {
      removeFavoriteLocal(symbol, exchange);
      handleRemoveFavorite(symbol);
    } else {
      addFavoriteLocal(symbol, exchange);
      handleAddFavorite(symbol);
    }
  }

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);

    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen); 
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

// ////////////////////////////////////////////////
// table
  const { coins, setCoins } = useCryptoAggregator();

  useEffect(() => {
    // attach accessToken and connect
    if (!accessToken) {
      return;
    }
    socket.auth = {token: accessToken};
    socket.connect();
  }, [accessToken])

  useEffect(() => {
    // this will display data through socket
    // listening for data
    socket.on("display-data", (data) => {
      const normalized = Object.fromEntries(
        data.map((coin => [coin._id, coin]))
      );
      setCoins(normalized);
    });

    return () => {
      socket.off("display-data");
    };
  }, [setCoins]);

  useEffect(() => {
    // talk to server, ask for data
    const emitData = () => {
      socket.emit("home-event", 
        exchangeOptions[selectedIndex].toLowerCase()
      );
    }
    if (socket.connected) {
      emitData();
    } else {
      socket.once("connect", 
        emitData
      );
    };
  }, [selectedIndex]);

  const columns = useMemo(() => [
    { field: 'symbol', headerName: 'Symbol', width: 90, },
    { field: 'price', headerName: 'Price', type: 'number', flex: 1, },
    { field: 'volume', headerName: 'Volume', type: 'number', width: 150, },
    { field: 'percent24h', headerName: '%24h', type: 'number', flex: 1, },
    { field: 'percent1h', headerName: '%1h', type: 'number', flex: 1, },
    { field: 'action', 
      headerName: "Favorite", 
      flex: 1, 

      renderCell: (params) => {
        const exchange = exchangeOptions[selectedIndex].toLowerCase();
        const isFav = favoriteCoins.some(
          element => element.symbol === params.row.symbol && element.exchange === exchange
        );

        return (
        <IconButton
          sx={{color: isFav ? "#ff1744" : "#ffee33"}}
          onClick={() => handleToggleFavorite(params.row.symbol)}
        >
          { isFav ? <IoIosRemoveCircle /> : <IoIosAddCircle />}
        </IconButton>
        )
      }

    }
  ]);

  const rows = useMemo(() => {
    return Object.values(coins).map(coin => ({ 
      id: coin._id,
      symbol: coin.base_currency, 
      price: coin.price, 
      volume: coin.volume_24h, 
      percent24h: coin.percent_change_24h,
      percent1h: coin.percent_change_1h, 
  }))}, [coins, selectedIndex]);

  return (
    <Container>
      {accessToken !== null ? (
        <Fragment>
    
    <Box textAlign="center">

      <ButtonGroup
        sx={{margin: "15px"}}
        color='favorite'
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button>{exchangeOptions[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>

    </Box>

      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {exchangeOptions.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>


    {/* table */}

    <Box 
      display="flex"
      justifyContent="center"
    >
      <Paper sx={{ height: 400, width: '70%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>

    </Fragment>
      ) : (
        <Typography
          variant='h6'
          textAlign={"center"}
          fontWeight={"bold"}
          color='text.secondary'
        >
          You are not logged in, {" "}
          <MuiLink 
            component={Link}
            to="/login"
            sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            log in
          </MuiLink>
        </Typography>
      )}
    
    </Container>
  );
}

export default HomePage
