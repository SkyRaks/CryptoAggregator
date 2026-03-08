import { Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";
import ProfilePage from "./pages/ProfilePage";

import { userAuth } from "./actions/user.auth";
// import CryptoAggregatorIcon from '../src/assets/CryptoAggregatorIcon.png';

function App() {

  const [mode, setMode] = useState("dark");

  const setAccessToken = userAuth((state) => (state.setAccessToken));

  const setFavoriteCoins = userAuth((state) => (state.setFavoriteCoins));

  const setUser = userAuth((state) => (state.setUser));

  useEffect(() => { // when page renders (or refresh) it gets access token
    const refreshAccessToken = async () => {

      try {
        const res = await fetch("/user/refresh", {
          method: "POST",
          credentials: "include",
        })

        const data = await res.json();
        console.log(data);

        if (data.success) {
          setAccessToken(data.accessToken);
          setFavoriteCoins(data.favoriteCoins);
          setUser(data.user);
          
        }
      } catch (error) {
        console.log("refresh error");
      }
    };
    refreshAccessToken();
  }, [])

  const theme = useMemo(
    () =>
      createTheme({
        palette:{
          mode,
          favorite: {
            main: "#ffee33",
            contrastText: "#000",
          },
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
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
        </Routes>

      </Box>
    </ThemeProvider>
  );
}

export default App
