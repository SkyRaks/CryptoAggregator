import { Route, Routes } from "react-router-dom";
import { useMemo, useState } from 'react'
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SignUpPage from "./pages/auth/SignUpPage";
import LoginPage from "./pages/auth/LoginPage";

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
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
        </Routes>

      </Box>
    </ThemeProvider>
  );
}

export default App
