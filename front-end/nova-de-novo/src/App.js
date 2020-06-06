import React from 'react';
import './App.css';
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from './theme'

import Item from './components/Item'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Item />
    </ThemeProvider>

  );
}

export default App;
