import * as React from 'react';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useFormik} from 'formik';
import * as yup from 'yup';
import getFirebase from "../../utils/getFirebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Name is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
});

export function AddUser() {
    const [open, setOpen] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async ({email, name}, {setFieldError}) => {
            setSubmitting(true);
            const {db} = getFirebase();
            try {
                const q = query(collection(db, "orga"), where("email", "==", email));
                const usersSnap = await getDocs(q);
                if (usersSnap.docs.length) {
                    setSubmitting(false);
                    setFieldError('email', 'User already exists');
                } else {
                    await addDoc(collection(db, "orga"), {name, email});
                    setSubmitting(false);
                    formik.resetForm();
                    handleClose();
                }
            } catch (e: any) {
                setSubmitting(false);
                console.error(e);
                formik.resetForm();
                handleClose();
            }
        },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    return (
        <React.Fragment>
            <Box>
                <Fab color="secondary" aria-label="add" onClick={handleClickOpen}>
                    <AddIcon/>
                </Fab>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={formik.handleSubmit}>
                    <DialogTitle>Add Organizer</DialogTitle>
                    <DialogContent>
                        <TextField
                            color="secondary"
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name ? formik.errors.name : ' '}
                        />
                        <TextField
                            color="secondary"
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ' '}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" type="submit" disabled={submitting}>Add User</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
}

export default AddUser;



