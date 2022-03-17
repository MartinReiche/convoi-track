import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MarkerIcon from '@mui/icons-material/AddLocation';
import CloseIcon from '@mui/icons-material/Close';
import {MapLocation} from "../models";
import {useMap} from "../mapProvider";

type Props = {
    lat: number | undefined,
    lng: number | undefined,
    onSetDestination: (place: MapLocation) => void,
    onClose: () => void
}

export function MapMenu({lat, lng, onSetDestination, onClose}: Props) {
    const [selectedLocation, setSelectedLocation] = React.useState<MapLocation>();
    const {maps} = useMap();

    React.useEffect(() => {
        if (maps && lat && lng) {
            const Geocoder = new maps.Geocoder();
            Geocoder.geocode({location: {lat, lng}}).then(result => {
                setSelectedLocation(new MapLocation({ coordinates: result.results[0] }))
            });
        }
    }, [maps, lat, lng])

    if (!selectedLocation) return null
    return (
        <Box sx={{width: '200px'}} onClick={(e) => e.stopPropagation()}>
            <MarkerIcon
                sx={{fontSize: 40, color: (theme) => theme.palette.primary.main, transform: 'translate(-50%,-100%)'}}/>
            <Paper sx={{maxWidth: '100%', transform: 'translate(0,-40px)'}}>
                <Box sx={{p: 2}}>
                    <Typography>{selectedLocation.address}</Typography>
                </Box>
                <MenuList>
                    <Divider sx={{mb: 1}}/>
                    <MenuItem
                        onClick={() => onSetDestination(selectedLocation)}
                    >
                        <ListItemIcon>
                            <MarkerIcon />
                        </ListItemIcon>
                        <ListItemText>Set as Destination</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={onClose}>
                        <ListItemIcon>
                            <CloseIcon />
                        </ListItemIcon>
                        <ListItemText>Close</ListItemText>
                    </MenuItem>
                </MenuList>
            </Paper>
        </Box>
    )
}

export default MapMenu
