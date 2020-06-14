import React from 'react';
import './App.css';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { SnackbarContainer } from 'uno-material-ui';
import theme from './theme'

import { AuthContextProvider } from "./auth/context/AuthContextProvider";

import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Routes from './Routes';

const browserHistory = createBrowserHistory();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <SnackbarContainer />
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </AuthContextProvider>
    </ThemeProvider>

  );
}

export default App;
