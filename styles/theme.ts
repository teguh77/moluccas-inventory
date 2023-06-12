import { Poppins } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

export const poppins = Poppins({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#aa33be',
    },
    secondary: {
      main: '#f73379',
    },
    error: {
      main: '#f50057',
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    fontFamily: ['Poppins', 'Roboto'].join(','),
  },
});

export default theme;
