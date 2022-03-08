import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Menu from "./menu";
import { ReactComponent as LogoText } from '../logos/logo_long.svg';

export default function Header() {

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static" enableColorOnDark={true}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{
                        height: { sm: 60, xs: 50 },
                        padding: '5px'
                    }}>
                        <LogoText height="100%" width="100%"/>
                    </Box>
                    <Menu />
                </Toolbar>
            </AppBar>
        </Box>
    );
}