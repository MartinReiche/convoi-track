import * as React from 'react';
import PropTypes, {InferProps} from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert, {AlertProps, AlertColor} from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function SimpleSnackbar({message, severity}: InferProps<typeof SimpleSnackbar.propTypes>) {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (message) setOpen(true);
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
            <Alert
                onClose={handleClose}
                severity={severity as AlertColor}
                sx={{width: '100%'}}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

SimpleSnackbar.propTypes = {
    message: PropTypes.string,
    severity: PropTypes.oneOf(['success','info','warning','error']).isRequired
}
