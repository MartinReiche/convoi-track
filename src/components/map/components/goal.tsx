import * as React from "react";
import PropTypes from "prop-types";
import Box from '@mui/material/Box';
import MarkerIcon from '@mui/icons-material/Room';

function Goal() {
    return (
        <Box>
            <MarkerIcon color="error" sx={{fontSize: 40, transform: 'translate(-50%,-100%)'}}/>
        </Box>
    )
}

Goal.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
}

export default Goal;