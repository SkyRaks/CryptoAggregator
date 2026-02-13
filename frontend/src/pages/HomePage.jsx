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

const socket = io("http://localhost:5000")

const paginationModel = { page: 0, pageSize: 5 };

const exchangeOptions = ['CoinMarketCap', 'Aggregated', 'Kraken'];

const HomePage = () => {
  const accessToken = userAuth((state) => state.accessToken);

  const favoriteCoins = userAuth((state) => state.favoriteCoins);

  const { addFavorite, removeFavorite } = useCryptoAggregator();

  const handleAddFavorite = (symbol) => {
    const exchange = exchangeOptions[selectedIndex].toLowerCase();

    if (!symbol || !exchange) {
      console.log("empty fields")
    } else {
      addFavorite(symbol, exchange);
    }
  }

  const handleRemoveFavorite = (symbol) => {
    const exchange = exchangeOptions[selectedIndex].toLowerCase();

    if (!symbol || !exchange) {
      console.log("empty fields");
    } else {
      removeFavorite(symbol, exchange);
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
  // const { coins, fetchCoins } = useCryptoAggregator();

  // useEffect(() => {
  //   fetchCoins(exchangeOptions[selectedIndex].toLowerCase())
  // }, [selectedIndex, fetchCoins])

  const { coins, setCoins } = useCryptoAggregator();

  useEffect(() => {
    // this will display data through socket
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
    // console.log("selected index: ", selectedIndex)
    if (socket.connected) {
      socket.emit("custom-event", 
        exchangeOptions[selectedIndex].toLowerCase()
      );
    } else {
      socket.once("connect", () => {
        socket.emit("custom-event", 
          exchangeOptions[selectedIndex].toLowerCase()
        );
      })
    }
  }, [selectedIndex]);
//   const numbers = [2, 5, 8, 1, 4];
// const isBiggerThan10 = numbers.some(element => element > 10);
// console.log(isBiggerThan10); // Output: false 


  const columns = useMemo(() => [
    { field: 'symbol', headerName: 'Symbol', width: 10 },
    { field: 'price', headerName: 'Price', type: 'number', width: 90, },
    { field: 'volume', headerName: 'Volume', type: 'number', width: 90, },
    { field: 'percent24h', headerName: '%24h', type: 'number', width: 90, },
    { field: 'percent1h', headerName: '%1h', type: 'number', width: 90, },
    { field: 'action', 
      headerName: "Favorite", 
      width: 100, 
      // sortable: false, 
      // filterable: false, 
      renderCell: (params) => {
        const exchange = exchangeOptions[selectedIndex].toLowerCase();
        const isFav = favoriteCoins.some(element => element.symbol === params.row.symbol && element.exchange === exchange);

        return (
        <IconButton
        sx={{color: isFav ? "#ff1744" : "#ffee33"}}
        onClick={() => { 
          isFav ? 
          handleRemoveFavorite(params.row.symbol)
          :
          handleAddFavorite(params.row.symbol)
          }}>
          { isFav ? <IoIosRemoveCircle /> : <IoIosAddCircle />}
        </IconButton>
        )
      }
    }
  ]);

  const rows = Object.values(coins).map(coin => ({ 
    id: coin._id,
    symbol: coin.base_currency, 
    price: coin.price, 
    volume: coin.volume_24h, 
    percent24h: coin.percent_change_24h,
    percent1h: coin.percent_change_1h, 
  }));

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
        {/* onClick={() => fetchCoins(exchangeOptions[selectedIndex])}>{exchangeOptions[selectedIndex]} */}
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

    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />
    </Paper>

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
