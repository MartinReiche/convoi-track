import * as React from "react";
import PropTypes from "prop-types";
import Box from '@mui/material/Box';
import MarkerIcon from '@mui/icons-material/Room';

export function Destination() {
    return (
        <Box>
            <MarkerIcon color="error" sx={{fontSize: 40, transform: 'translate(-50%,-100%)'}}/>
        </Box>
    )
}

Destination.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
}

export default Destination;