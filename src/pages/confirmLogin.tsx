import * as React from "react";
import {useFormik} from "formik";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {ReactComponent as Logo} from "../logos/logo_quad.svg";
import getFirebase from "../utils/getFirebase";
import {isSignInWithEmailLink, signInWithEmailLink} from 'firebase/auth';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from "@mui/material/Typography";

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
});

export function ConfirmLogin() {
    const [email, setEmail] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async ({email}) => {
            setEmail(email);
        },
    });

    React.useEffect(() => {
        const {auth} = getFirebase();
        if (isSignInWithEmailLink(auth, window.location.href)) {
            const emailFromLocalStorage = window.localStorage.getItem('emailForSignIn');
            const signInEmail = emailFromLocalStorage || email;
            if (signInEmail) {
                signInWithEmailLink(auth, signInEmail, window.location.href)
                    .then(() => {
                        setLoading(false);
                    })
                    .catch((error) => {
                        if (error.message.search(/auth\/invalid-email/g)) {
                            formik.setErrors({email: 'The email provided does not match the sign-in email address.'})
                        } else {
                            setError('Something went wrong. Please try again later.');
                        }
                        window.localStorage.removeItem('emailForSignIn');
                        setLoading(false);
                    });
            } else {
                setLoading(false);
            }
        }
    }, [email, formik])

    if (loading) return null;
    return (
        <Container maxWidth={"xs"}>
            <Grid
                container
                direction="column"
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{pt: 12}}
            >
                <Grid item sx={{display: 'flex', justifyContent: 'center'}}>
                    <Box sx={{maxWidth: '250px', mb: 8}}>
                        <Logo width="100%" height="100%"/>
                    </Box>
                </Grid>
                {error ? (
                    <Grid item>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <ErrorIcon color="error" sx={{fontSize: '3em', mr: 2}}/>
                            <Typography color="error">
                                {error}
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    <React.Fragment>
                        <Grid item sx={{mb:5}}>
                            <Typography>
                                Hi! To make sure it's really you, please enter the email address for which
                                you received the login link.
                            </Typography>
                        </Grid>
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
                                    formik.touched.email
                                    && formik.errors.email ? formik.errors.email : ' '
                                }
                                color="secondary"
                            />
                        </Grid>
                        <Grid item sx={{mt: 5, justifyContent: 'center', display: 'flex'}}>
                            <Button color="secondary" variant="contained" type="submit" disabled={loading}>
                                Confirm Email Address
                            </Button>
                        </Grid>
                    </React.Fragment>
                )}
            </Grid>
        </Container>
    )
}

export default ConfirmLogin;