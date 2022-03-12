import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/MobileDateTimePicker';
import * as yup from "yup";
import {useFormik} from "formik";
import getFirebase from "../../utils/getFirebase";
import {addDoc, collection} from "firebase/firestore";
import {useAuth} from "../auth/authProvider";

const validationSchema = yup.object({
    name: yup
        .string()
        .required('Name is required'),
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    etd: yup
        .number()
        .required()
});

export default function AddConvoi() {
    const [loading, setLoading] = React.useState(false);
    const {user} = useAuth();


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            etd: new Date()
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
            } catch (e: any) {
                setLoading(false);
                // setAlert({ severity: 'error', message: 'Something went wrong. Please try again later.'});
            }
        },
    });

    return (
        <Card sx={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            mr: '10px',
            mb: '10px',
            maxWidth: 500,
            zIndex: 1,
        }}>
            <form onSubmit={formik.handleSubmit}>
                <CardHeader title="Add a new Convoy"/>
                <CardContent>
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
                        helperText={formik.touched.name && formik.errors.name && formik.errors.name}
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
                        helperText={formik.touched.email && formik.errors.email && formik.errors.email}
                    />
                    <DateTimePicker
                        label="Date&Time picker"
                        value={formik.values.etd}
                        onChange={(value) => formik.setFieldValue('etd', value)}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth color="secondary" id="etd"/>
                        )}
                    />
                </CardContent>
                <CardActions sx={{justifyContent: 'flex-end'}}>
                    <Button color="secondary" variant={"contained"} size="small" type="submit">Create Convoy</Button>
                </CardActions>
            </form>
        </Card>

    );
}