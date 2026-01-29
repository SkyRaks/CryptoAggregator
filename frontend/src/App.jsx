import { Route, Routes } from "react-router-dom";
import { useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';

import { io } from "socket.io-client";
// import dotenv from 'dotenv';

// dotenv.config({ path: "../../CryptoAggregator/.env" });

// const PORT = process.env.PORT || 5000

const socket = io("http://localhost:5000")

socket.on("connect", () => {
  console.log("connnected to socket: ", socket.id);
})

function App() {
  const [mode, setMode] = useState("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette:{
          mode,
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{height: '100vh'}}>

        <NavBar toggleTheme={toggleTheme} mode={mode}/> 

        <Routes>
          <Route path="/" element={<HomePage />}></Route>
        </Routes>

      </Box>
    </ThemeProvider>
  );
}

export default App
