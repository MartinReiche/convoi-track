import {createTheme} from '@mui/material';
import {PaletteMode} from "@mui/material";
import {amber, deepOrange, grey} from "@mui/material/colors";

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#242b38',
        },
        secondary: {
            main: '#37ab9c',
        },
    },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        primary: {
            ...amber,
            ...(mode === 'dark' && {
                main: amber[300],
            }),
        },
        ...(mode === 'dark' && {
            background: {
                default: deepOrange[900],
                paper: deepOrange[900],
            },
        }),
        text: {
            ...(mode === 'light'
                ? {
                    primary: grey[900],
                    secondary: grey[800],
                }
                : {
                    primary: '#fff',
                    secondary: grey[500],
                }),
        },
    },
});
