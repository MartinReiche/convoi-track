import * as React from 'react';
import Box from '@mui/material/Box';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import {Container} from "@mui/material";
import getFirebase from "../utils/getFirebase";
import {sendSignInLinkToEmail} from "firebase/auth";
import Loading from "../components/loading";
import {ReactComponent as Logo} from '../logos/logo_quad.svg';

const validationSchema = yup.object({
    email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string()
        .required('Password is required'),
});


export default function Login() {
    const [submitting, setSubmitting] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async ({email, password}, {setFieldError, setFieldValue}) => {
            const {auth} = getFirebase();
            setSubmitting(true)
            try {

                const actionCodeSettings = {
                    url: "http://localhost:3000/",
                    handleCodeInApp: true,
                };

                sendSignInLinkToEmail(auth, email, actionCodeSettings)
                    .then(() => {
                        // The link was successfully sent. Inform the user.
                        // Save the email locally so you don't need to ask the user for it again
                        // if they open the link on the same device.
                        // window.localStorage.setItem('emailForSignIn', email);
                        // ...
                        console.log('SignInLink sent');
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });

                setSubmitting(false);
            } catch (e: any) {
                setSubmitting(false);
                switch (e.message) {
                    case 'Firebase: Error (auth/wrong-password).':
                        setFieldError('password', 'Wrong Password');
                        setFieldValue('password', '', false);
                        break;
                    case 'Firebase: Error (auth/user-not-found).':
                        setFieldError('email', 'This user does not exist');
                        setFieldValue('password', '', false);
                        break;
                    default:
                        setFieldError('email', 'Wrong login credentials');
                        setFieldValue('password', '', false);
                }
            }
        },
    });

    return (
        <React.Fragment>
            <Loading open={submitting}/>
            <Box sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                pt: 10
            }}>
                <Container maxWidth={"xs"}>
                    <Grid container direction="column" component="form" onSubmit={formik.handleSubmit}>
                        <Grid item sx={{ p: 8}}>
                            <Logo width="100%" height="100%"/>
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
                                helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ' '}
                                color="secondary"
                            />
                        </Grid>
                        <Grid item sx={{padding: 2, justifyContent: 'center', display: 'flex'}}>
                            <Button color="secondary" variant="contained" type="submit" disabled={submitting}>
                                Send Login Link
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    )
}