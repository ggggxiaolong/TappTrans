import React, { useState, FormEvent, useEffect, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
// import Link from '@material-ui/core/Link';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Snackbar } from "@material-ui/core";
import { useCookies } from "react-cookie";
import { Login } from "../entity/login";
import { Token } from "../entity/token";
import { Redirect } from 'react-router-dom';
import { TokenContext } from "../config/clinetProvicer";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const LOGIN = gql`
  query login($email: String!, $password: String!) {
    login(mail: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export default function SignIn() {
  const classes = useStyles();
  const [token, setToken] = useCookies(["token"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [skip, setSkip] = useState(true);
  const { loading, error, data } = useQuery<Login>(LOGIN, {
    variables: { email: email, password: password },
    skip: skip
  });
  const [redirect, setRedirect] = useState(false);
  const refreshToken = useContext(TokenContext)

  useEffect(() => {
    if(token.refreshToken){
      refreshToken.refresh().then(value => {
        if(value){
          setRedirect(true)
        }
      })
    }
  })  

  function login(e: FormEvent) {
    e.preventDefault();
    setSkip(false);
  }
  function onSnackbarClose() {
    setSkip(true);
  }
  function onSuccess(token: Token | null) {
    setSkip(true);
    if (token) {
      setToken("token", token.accessToken);
      setToken("refreshToken", token.refreshToken);
      setRedirect(true);
    }
  }
  if (redirect) return <Redirect to="/home"/>
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={login}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            autoFocus
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
      {loading && <LinearProgress />}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        autoHideDuration={2000}
        open={error !== undefined}
        onClose={onSnackbarClose}
        message={
          <span id="error-id">{error && error.graphQLErrors[0].message}</span>
        }
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={data !== undefined}
        autoHideDuration={800}
        onClose={() => onSuccess(data ? data.login : null)}
        message={<span id="success-id">Login success</span>}
      />
    </Container>
  );
}
