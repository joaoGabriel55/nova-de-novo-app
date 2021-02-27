import React from "react";
import { useHistory } from "react-router-dom";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { snackbarService } from "uno-material-ui";

import { userLogin } from "../../services/auth/AuthService";

import { AuthContext } from "../context/AuthContextProvider";
import { INVALID_CREDENTIALS, USER_NOT_ADMIN } from "../../constants/messages";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="">
        Nova de Novo - by Gabriel Quaresma
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();

  const [alert, setAlert] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");
  const [userCredentials, setUserCredentials] = React.useState({
    username: null,
    password: null,
  });
  const [userLogged, setUserLogged] = React.useContext(AuthContext);

  const updateField = (e) => {
    setUserCredentials({
      ...userCredentials,
      [e.target.name]: e.target.value,
    });
  };

  function signInUser(e) {
    e.preventDefault();
    if (!userCredentials.username || !userCredentials.password)
      snackbarService.showSnackbar("Informe seu usuário e senha", "info");
    else {
      userLogin(userCredentials)
        .then((res) => {
          const { accessToken, refreshToken } = res.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          if (!userLogged)
            setUserLogged({ username: userCredentials.username });
          history.replace("/home");
          setUserCredentials({});
        })
        .catch((err) => {
          const { status } = err.response;
          if (status === 401) setErrorMessage(USER_NOT_ADMIN);
          else setErrorMessage(INVALID_CREDENTIALS);
          setAlert(true);
        });
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={signInUser}>
            {alert ? (
              <Alert
                severity="error"
                onClose={() => {
                  setAlert(false);
                }}
              >
                {errorMessage}
              </Alert>
            ) : null}
            <TextField
              variant="outlined"
              color="secondary"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              value={userCredentials.username}
              onChange={updateField}
              autoFocus
            />
            <TextField
              variant="outlined"
              color="secondary"
              margin="normal"
              required
              fullWidth
              name="password"
              value={userCredentials.password}
              label="Password"
              type="password"
              id="password"
              onChange={updateField}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Entrar
            </Button>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://wallpaperaccess.com/full/2489626.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
  },
}));
