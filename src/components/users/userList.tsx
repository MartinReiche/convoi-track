import * as React from 'react';
import PropTypes, {InferProps} from 'prop-types';
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

interface User {
    name: string;
    email: string;
    id: string;
}

function UserList({users, deleteCallback}: InferProps<typeof UserList.propTypes>) {
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState<User|null>(null);

    const handleDialogOpen = (user: User) => {
          setCurrentUser(user);
          setDialogOpen(true);
    }

    const handleClose = () => {
        setDialogOpen(false);
    }

    const handleDeleteUser = () => {
        handleClose();
        deleteCallback(currentUser?.id);
    }

    return (
        <React.Fragment>
            <List dense sx={{width: '100%'}}>
                {users.map((user, index) => {
                    const labelId = `checkbox-list-secondary-label-${index}`;
                    return (
                        <ListItem
                            key={index}
                            secondaryAction={
                                <IconButton color="secondary" onClick={() => handleDialogOpen(user)}>
                                    <DeleteIcon/>
                                </IconButton>
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <NameAvatar name={user.name}/>
                                </ListItemAvatar>
                                <Box >
                                    <ListItemText id={labelId} primary={user.name}/>
                                    <ListItemText id={labelId} secondary={user.email}/>
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
                        {`Do you really want to delete te Organizer Account for ${currentUser?.name} 
                          (${currentUser?.email})`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleClose} autoFocus>Cancel</Button>
                    <Button color="error" onClick={handleDeleteUser}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    );
}

UserList.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    deleteCallback: PropTypes.func.isRequired
}

export default UserList;