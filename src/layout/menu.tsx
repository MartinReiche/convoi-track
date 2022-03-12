import * as React from "react";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useAuth} from "../components/auth/authProvider";

export function Home() {
    const {signout} = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogoutClicked =() => {
        setAnchorEl(null);
        signout();
    }
    return (
        <React.Fragment>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleClick}
            >
                <MenuIcon/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleLogoutClicked}>Logout</MenuItem>
            </Menu>
        </React.Fragment>
    )
}

export default Home;