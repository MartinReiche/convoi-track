import * as React from 'react';
import Box from '@mui/material/Box';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import Container from '@mui/material/Container';
import getFirebase from "../utils/getFirebase";
import Loading from "../components/loading";
import {ReactComponent as Logo} from '../logos/logo_quad.svg';
import {addDoc, collection, doc, onSnapshot} from 'firebase/firestore';
import {useAuth} from "../components/auth/authProvider";
import ErrorIcon from '@mui/icons-material/Error';
import SuccessIcon from '@mui/icons-material/CheckCircle';
import Typography from "@mui/material/Typography";

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
});

export default function Login() {
    const [loading, setLoading] = React.useState(false);
    const [requestId, setRequestId] = React.useState<string | null>(null);
    const [error, setError] = React.useState(false);
    const [message, setMessage] = React.useState<boolean | string>(false);
    const {user} = useAuth();

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async ({email}) => {
            const {db} = getFirebase();
            setLoading(true)
            try {
                const loginRequest = await addDoc(collection(db, 'loginRequests'), {
                    email,
                    host: window.location.protocol + '//' + window.location.host + '/',
                });
                setRequestId(loginRequest.id);
                window.localStorage.setItem('emailForSignIn', email);
            } catch (e: any) {
                setLoading(false);
                setError(true);
                setMessage("Something went wrong. Please try again later.");
            }
        },
    });

    React.useEffect(() => {
        if (requestId) {
            const {db} = getFirebase();
            const unsubscribe = onSnapshot(doc(db, 'loginRequests', requestId), doc => {
                if (doc.exists() && doc.data().success) {
                    setLoading(false);
                    setMessage('A sign-in link has been sent to the provided email address.')
                } else if (doc.exists() && doc.data().error) {
                    formik.setErrors({email: doc.data().error});
                    window.localStorage.removeItem('emailForSignIn');
                    setLoading(false);
                }
            });
            return function cleanUp() {
                unsubscribe();
            }
        }
    }, [requestId, formik])


    return (
        <React.Fragment>
            <Loading open={loading || user.loading}/>
                <Container maxWidth={"xs"}>
                    <Grid
                        container
                        direction="column"
                        component="form"
                        onSubmit={formik.handleSubmit}
                        sx={{ pt: 12 }}
                    >
                        <Grid item sx={{display: 'flex', justifyContent: 'center'}}>
                            <Box sx={{maxWidth: '250px', mb: 8}}>
                                <Logo width="100%" height="100%"/>
                            </Box>
                        </Grid>
                        {message ? (
                            <Grid item>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    {error ? (
                                        <React.Fragment>
                                            <ErrorIcon color="error" sx={{fontSize: '3em', mr: 2}}/>
                                            <Typography color="error">
                                                {message}
                                            </Typography>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <SuccessIcon color="secondary" sx={{fontSize: '3em', mr: 2}}/>
                                            <Typography color="secondary">
                                                {message}
                                            </Typography>
                                        </React.Fragment>
                                    )}
                                </Box>
                            </Grid>
                        ) : (
                            <React.Fragment>
                                <Grid item>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={
                                            formik.touched.email && formik.errors.email ? formik.errors.email : ' '
                                        }
                                        color="secondary"
                                    />
                                </Grid>
                                <Grid item sx={{mt: 5, justifyContent: 'center', display: 'flex'}}>
                                    <Button color="secondary" variant="contained" type="submit" disabled={loading}>
                                        Send Login Link
                                    </Button>
                                </Grid>
                            </React.Fragment>
                        )}
                    </Grid>
                </Container>
        </React.Fragment>
    )
}