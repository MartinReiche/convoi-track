import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useFormik} from 'formik';
import * as yup from 'yup';
import getFirebase from "../../utils/getFirebase";
import {collection, addDoc, onSnapshot, doc} from "firebase/firestore";
import {useAuth} from "../auth/authProvider";
import Loading from "../loading";
import AlertBar, {Alert} from '../alert';

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Name is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
});

export function AddOrganizer() {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [requestId, setRequestId] = React.useState<string | null>(null);
    const [alert, setAlert] = React.useState<Alert>({ severity: 'info', message: null });

    const {user} = useAuth();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async ({email, name}) => {
            const {db} = getFirebase();
            setLoading(true);
            try {
                const requestRef = await addDoc(collection(db, `projects/${user.project}/addOrgaRequest`), {
                    name,
                    email,
                    host: window.location.protocol + '//' + window.location.host + '/',
                });
                setRequestId(requestRef.id);
                handleClose();
            } catch (e: any) {
                setLoading(false);
                setAlert({ severity: 'error', message: 'Something went wrong. Please try again later.'});
                handleClose();
            }
        },
    });

    React.useEffect(() => {
        if (requestId) {
            const {db} = getFirebase();
            const unsubscribe = onSnapshot(doc(db, `projects/${user.project}/addOrgaRequest`, requestId), doc => {
                if (doc.exists() && doc.data().success) {
                    setLoading(false);
                    setAlert({
                        severity: 'success',
                        message: 'The user has been added and an invitation email has been sent.'
                    });
                } else if (doc.exists() && doc.data().error) {
                    setLoading(false);
                    setAlert({severity: 'error', message: doc.data().error})
                }
            });
            return function cleanUp() {
                unsubscribe();
            }
        }
    }, [user.project, requestId])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    return (
        <React.Fragment>
            <Loading open={loading || user.loading}/>
            <AlertBar {...alert} />
            <Button variant="contained" onClick={handleClickOpen}>
                Add Organizer
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={formik.handleSubmit}>
                    <DialogTitle>Add Organizer</DialogTitle>
                    <DialogContent>
                        <TextField
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
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button variant="contained" type="submit" disabled={loading}>Add Organizer</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </React.Fragment>
    );
}

export default AddOrganizer;



