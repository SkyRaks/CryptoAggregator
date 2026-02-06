import { Container, Box, TextField, Button, Typography, Paper, Stack, Snackbar, Alert, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { userAuth } from "../../actions/user.auth.js";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success", // "success" | "error" | "warning" | "info"
    });

    const [newUser, setNewUser] = useState({
        name: "", // daniel
        email: "", // daniel123@mail.com
        password: "", // iamcool123
        confirmPassword: "",
    });

    const { createUser } = userAuth();

    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!newUser.name || !newUser.email || !newUser.password || !newUser.confirmPassword) {
            setSnackbar({ open: true, message: "please provide all fields", severity: "error", });
            return;
        }

        if (newUser.password !== newUser.confirmPassword) {
            setSnackbar({ open: true, message: "passwords don't match", severity: "error", });
            return;
        }

        const { success, message } = await createUser({name: newUser.name, email: newUser.email, password: newUser.password});

        console.log("success: ", success);
        console.log("message: ", message);

        setSnackbar({
            open:true,
            message:message,
            severity:success ? "success" : "error",
        });

        if (success == true) {
            setNewUser({ name: "", email: "", password: "", confirmPassword: ""});
        }
        // navigate("/login");
    }

    return (
        <Container maxWidth="sm">
      <Stack spacing={4} mt={4}>
        <Typography variant="h4" textAlign="center" fontWeight="bold">
          Create Account
        </Typography>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              fullWidth
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={newUser.confirmPassword}
              onChange={(e) =>
                setNewUser({
                  ...newUser,
                  confirmPassword: e.target.value,
                })
              }
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSignup}
            >
              Sign Up
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
                to="/login"
                sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
                login to account
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

export default SignUpPage;