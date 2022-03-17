import * as React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, {AlertProps, AlertColor} from '@mui/material/Alert';


const AlertComponent = React.forwardRef<HTMLDivElement, AlertProps>(function AlertComponent(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export type Alert = {
    message: string | null
    severity: 'success' | 'info' | 'warning' | 'error'
}


export default function AlertBar({message, severity}: Alert) {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (message) setOpen(true);
        else setOpen(false);
    }, [message])

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>
        </React.Fragment>
    );

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}
            action={action}
        >
            <AlertComponent
                onClose={handleClose}
                severity={severity as AlertColor}
                sx={{width: '100%'}}
            >
                {message}
            </AlertComponent>
        </Snackbar>
    );
}

AlertBar.propTypes = {
    message: PropTypes.string,
    severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']).isRequired
}
