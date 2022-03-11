import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import NameAvatar from '../avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import {GeoPoint} from "firebase/firestore";

type Convoi = {
    id: string;
    name: string;
    etd: Date;
    eta: Date;
    to: GeoPoint;
}

interface ConvoiListProps {
    convois: Convoi[]
    deleteCallback: (id: string) => {}
}


function ConvoiList({convois, deleteCallback}: ConvoiListProps) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [currentConvoi, setCurrentConvoi] = React.useState<Convoi>();

    const handleDialogOpen = (convoi: Convoi) => {
        setCurrentConvoi(convoi);
        setDialogOpen(true);
    }

    const handleClose = () => {
        setDialogOpen(false);
    }

    const handleDeleteConvoi = () => {
        handleClose();
        if (currentConvoi) deleteCallback(currentConvoi.id);
    }

    return (
        <React.Fragment>
            <List dense sx={{width: '100%'}}>
                {convois.map((convoi, index) => {
                    const labelId = `checkbox-list-secondary-label-${index}`;
                    return (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton color="secondary" onClick={() => handleDialogOpen(convoi)}>
                                    <DeleteIcon/>
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <NameAvatar name={convoi.name}/>
                                </ListItemAvatar>
                                <Box>
                                    <ListItemText id={labelId} primary={convoi.name}/>
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Delete Organizer Account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`Do you really want to delete ${currentConvoi?.name}?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleClose} autoFocus>Cancel</Button>
                    <Button color="error" onClick={handleDeleteConvoi}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}

export default ConvoiList;