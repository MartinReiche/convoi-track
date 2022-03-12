import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import Header from "./header";
import Box from "@mui/material/Box";
import {getDesignTokens} from "../theme";
import {createTheme} from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const ColorModeContext = React.createContext({
    toggleColorMode: () => {
    }
});

const Layout: React.FC = ({children}) => {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');

    const colorMode = React.useMemo(() => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const mode = prevMode === 'light' ? 'dark' : 'light'
                    localStorage.setItem('colorMode', mode);
                    return mode;
                });
            },
        }), []);
    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

    React.useEffect(() => {
        const mode = localStorage.getItem('colorMode');
        if (mode === 'light' || mode === 'dark') setMode(mode);
    },[])

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Box sx={{minHeight: '100vh'}}>
                    <Header/>
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        height: {
                            xs: 'calc(100vh - 56px)',
                            sm: 'calc(100vh - 64px)',
                        },
                    }}>
                        {children}
                    </Box>
                </Box>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

export default Layout;