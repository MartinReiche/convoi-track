import * as React from 'react';
import Box from '@mui/material/Box';
import {useFormik} from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import {Container} from "@mui/material";
import getFirebase from "../utils/getFirebase";
import {signInWithEmailAndPassword} from "firebase/auth";
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
                await signInWithEmailAndPassword(auth, email, password);
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
                        <Grid item>
                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={
                                    formik.touched.password && formik.errors.password ? formik.errors.password : ' '
                                }
                                color="secondary"
                            />
                        </Grid>
                        <Grid item sx={{padding: 2, justifyContent: 'center', display: 'flex'}}>
                            <Button color="secondary" variant="contained" type="submit" disabled={submitting}>
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </React.Fragment>
    )
}