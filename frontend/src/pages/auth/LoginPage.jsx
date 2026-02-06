import { Container, Box, TextField, Button, Typography, Paper, Stack, Snackbar, Alert, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
// import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // "success" | "error" | "warning" | "info"
    });

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    // const { loginUser } = useUserStore();

    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!user.email || !user.password) {
            setSnackbar({ open: true, message: "please provide all fields", severity: "error", });
            return;
        }

        const { success, message } = await loginUser(user);

        console.log("success: ", success);
        console.log("message: ", message);

        navigate("/");
    }

    return (
        <Container maxWidth="sm">
      <Stack spacing={4} mt={4}>
        <Typography variant="h4" textAlign="center" fontWeight="bold">
          Login to your account
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
            //   value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
            //   value={user.password}
              onChange={(e) =>
                setUser({ ...user, password: e.target.value })
              }
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLogin}
            >
              Login
            </Button>
          </Stack>
          
          <Typography
            variant='h6'
            textAlign={"center"}
            fontWeight={"bold"}
            color='text.secondary'
            marginTop={2}
            >

            <MuiLink 
            component={Link}
            to="/signup"
            sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
            register account
            </MuiLink>
            </Typography>

        </Paper>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    );
};

export default LoginPage;