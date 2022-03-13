import * as React from 'react';
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import ArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import ArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ArrowDowntIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Drawer from '@mui/material/Drawer';

interface MapMenuProps {
    children: React.ReactElement
    open: boolean
    onToggleMenuOpen: () => void
}

const MapMenu = ({children, open, onToggleMenuOpen}: MapMenuProps) => {
    return (
        <React.Fragment>
            <Box sx={{ display: { xs: 'none', md: 'block'}}}>
                <Drawer
                    open={open}
                    hideBackdrop={true}
                    variant="persistent"
                >
                    <Box sx={{pt: '64px', minWidth: 350 }}>
                        {children}
                    </Box>
                </Drawer>
                <Box sx={{position: 'absolute', bottom: 20, left: 20, zIndex: (theme) => theme.zIndex.drawer}}>
                    <Fab onClick={onToggleMenuOpen} color="primary">
                        {open ?
                            <ArrowLeftIcon sx={{fontSize: 40}}/>
                            : <ArrowRightIcon sx={{fontSize: 40}}/>
                        }
                    </Fab>
                </Box>
            </Box>
            <Box sx={{display: {xs: 'block', md: 'none'}}}>
                <Drawer
                    open={open}
                    hideBackdrop={true}
                    variant="persistent"
                    anchor="top"
                >
                    <Box sx={{pt: { xs: '56px', sm: '64px' }, display: 'flex' }}>
                        {children}
                    </Box>
                </Drawer>
                <Box sx={{position: 'absolute', bottom: 20, left: 20, zIndex: (theme) => theme.zIndex.drawer}}>
                    <Fab onClick={onToggleMenuOpen} color="primary">
                        {open ?
                            <ArrowUpIcon sx={{fontSize: 40}}/>
                            : <ArrowDowntIcon sx={{fontSize: 40}}/>
                        }
                    </Fab>
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default MapMenu;