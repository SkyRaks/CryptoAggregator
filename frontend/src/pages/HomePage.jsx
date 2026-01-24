import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useCryptoAggregator } from "../actions/display.coin";
import { useEffect } from 'react';

const paginationModel = { page: 0, pageSize: 5 };

const HomePage = () => {

  const { coins, fetchCoins } = useCryptoAggregator();

  useEffect(() => {
    fetchCoins()
  }, [fetchCoins]);
  console.log("coins", coins);

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
  );
}

export default HomePage
