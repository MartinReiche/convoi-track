import {PaletteMode} from "@mui/material";
import {teal, blueGrey, grey} from "@mui/material/colors";

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        primary: {
            main: blueGrey[800],
            ...(mode === 'dark' && {
               main: teal[600],
            }),
        },
        background: {
            paper: grey[200],
            default: '#f8f8f8',
            ...(mode === 'dark' && {
                paper: grey[900],
                default: '#121212',
            })
        },
    },
});
