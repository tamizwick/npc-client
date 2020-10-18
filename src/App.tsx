import React from 'react';
import './App.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Page from './components/Page/Page';

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#36827f'
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Page />
      </div>
    </ThemeProvider>
  );
}

export default App;
