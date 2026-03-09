import { alpha, createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22d3ee',
      light: '#67e8f9',
      dark: '#0891b2',
    },
    secondary: {
      main: '#fb923c',
      light: '#fdba74',
      dark: '#c2410c',
    },
    background: {
      default: '#061321',
      paper: '#0d1e2d',
    },
    text: {
      primary: '#ecfeff',
      secondary: '#9fb6c3',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderColor: alpha('#67e8f9', 0.35),
          backgroundColor: alpha('#0f172a', 0.5),
        },
      },
    },
  },
})