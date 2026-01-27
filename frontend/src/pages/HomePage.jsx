import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useCryptoAggregator } from "../actions/display.coin";
import { useEffect, useState, Fragment, useRef } from 'react';

import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const paginationModel = { page: 0, pageSize: 5 };

const exchangeOptions = ['Aggregated', 'CoinMarketCap', 'Kraken'];

const HomePage = () => {

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
  const { coins, fetchCoins } = useCryptoAggregator();

  useEffect(() => {
    fetchCoins(exchangeOptions[selectedIndex].toLowerCase())
  }, [selectedIndex, fetchCoins])

  const columns = [
    { field: 'symbol', headerName: 'Symbol', width: 10 },
    { field: 'price', headerName: 'Price', type: 'number', width: 90, },
    { field: 'volume', headerName: 'Volume', type: 'number', width: 90, },
    { field: 'percent24h', headerName: '%24h', type: 'number', width: 90, },
    { field: 'percent1h', headerName: '%1h', type: 'number', width: 90, },
  ];

  const rows = Object.values(coins).map(coin => ({ 
    id: coin._id,
    symbol: coin.base_currency, 
    price: coin.price, 
    volume: coin.volume_24h, 
    percent24h: coin.percent_change_24h,
    percent1h: coin.percent_change_1h, 
  }));

  return (
    <Fragment>

    <ButtonGroup
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
                      // disabled={index === 2} 
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
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
    </Fragment>
  );
}

export default HomePage
