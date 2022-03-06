import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import Header from "./header";
import {darkTheme} from '../theme'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';

const Layout: React.FC = ({children}) => (
    <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <div className="container">
            <Header />
            {children}
        </div>
    </ThemeProvider>
)

export default Layout;