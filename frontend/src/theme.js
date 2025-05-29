
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff6f00', 
    },
    secondary: {
      main: '#4caf50', 
    },
    background: {
      default: '#fff8f0', 
      paper: '#ffffff', 
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
});

export default theme;
