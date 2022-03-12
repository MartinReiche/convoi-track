import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import Header from "./header";
import {darkTheme} from '../theme'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Box from "@mui/material/Box";

const Layout: React.FC = ({children}) => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <Box sx={{ minHeight: '100vh' }}>
                <Header/>
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: {
                        xs: 'calc(100vh - 56px)',
                        sm: 'calc(100vh - 64px)',
                    }
                }}>
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Layout;