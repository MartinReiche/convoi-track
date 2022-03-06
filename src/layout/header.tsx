import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {getFirebase} from "../utils/getFirebase";
import {collection, addDoc} from "firebase/firestore";

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
                <Toolbar>
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
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        ConvoiTrack
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}