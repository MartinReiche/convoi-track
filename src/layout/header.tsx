import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Menu from "./menu";
import ToggleColorMode from "./toggleColorMode";
import {ReactComponent as LogoText} from '../logos/logo_long.svg';
import {Link} from "react-router-dom";

export default function Header() {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{
                        height: {sm: 60, xs: 50},
                        padding: '5px'
                    }}
                    >
                        <Link to="/">
                            <LogoText height="100%" width="100%"/>
                        </Link>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <ToggleColorMode/>
                        <Menu/>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}