import * as React from "react";
import PropTypes, {InferProps} from "prop-types";
import Box from "@mui/material/Box";

function Marker({children}: InferProps<typeof Marker.propTypes>) {
    return (
        <Box sx={{transform: 'translate(-50%,-100%)'}}>
            {children}
        </Box>
    )
}


Marker.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
    children: PropTypes.element.isRequired
}

export default Marker;