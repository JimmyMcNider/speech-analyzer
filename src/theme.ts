import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#E31837', // Red Cross Red
      contrastText: '#fff',
    },
    secondary: {
      main: '#747474', // Gray for secondary text
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Arial", "Helvetica", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#000000',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#000000',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#000000',
    },
    body1: {
      fontSize: '1rem',
      color: '#333333',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px',
        },
        containedPrimary: {
          backgroundColor: '#E31837',
          '&:hover': {
            backgroundColor: '#C41230',
          },
        },
      },
    },
  },
}); 