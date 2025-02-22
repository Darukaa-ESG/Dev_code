import { Box, ThemeProvider, Typography, createTheme, CssBaseline } from '@mui/material'
import { useState } from 'react';
import Routing from './routing';
import Sidebar from './component/view/Sidebar';
import "./App.scss";

const App = () => {
  const [open] = useState(true);
  const theme = createTheme({
    palette: {
      background: {
        default: '#F8F8F8'
      },
      text: {
        primary: '#151E15',
        secondary: '#666666',
        disabled: '#888888',
      },
    },
    typography: {
      fontFamily: "Poppins",
      fontSize: 14,
      button: {
        textTransform: "none",
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Routing open={open} />
        </Box>
        <footer className='footer'>
          <Typography className='footer-heading'>
            © Copyright 2025. Darukaa Earth. All Rights Reserved.
          </Typography>
        </footer>
      </Box>
    </ThemeProvider>
  )
}

export default App;
