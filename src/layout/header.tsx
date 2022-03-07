import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {getFirebase} from "../utils/getFirebase";
import {collection, addDoc} from "firebase/firestore";
import { ReactComponent as LogoText } from '../logos/logo_long.svg';

export default function Header() {

    const handleMenuClick = async () => {
        const {db} = getFirebase();
        await addDoc(collection(db, "clicks"), {
            date: Date.now(),
        });
    }

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
                        {/*<img className="logo" src={logo} alt="Logo" />*/}
                        <LogoText height="100%" width="100%"/>
                    </Box>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleMenuClick}
                    >
                        <MenuIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}