import * as React from "react";
import PropTypes from "prop-types";
import Box from '@mui/material/Box';
import MyLocationIcon from "@mui/icons-material/MyLocation";


export function MyLocation() {
    return (
        <Box>
            <MyLocationIcon color="error" sx={{fontSize: 30, transform: 'translate(-50%,-50%)'}}/>
        </Box>
    )
}

MyLocation.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
}

export default MyLocation;