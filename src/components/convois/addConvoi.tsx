import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/MobileDateTimePicker';
import * as yup from "yup";
import {useFormik} from "formik";
import getFirebase from "../../utils/getFirebase";
import {addDoc, collection} from "firebase/firestore";
import {useAuth} from "../auth/authProvider";
import Box from '@mui/material/Box';
import {PlaceSearch} from "../map";
import Loading from '../loading';
import {GoogleMapsApi} from "../map";
import Chip from '@mui/material/Chip';
import Typography from "@mui/material/Typography";
import {GeoPoint} from 'firebase/firestore';
import {useNavigate} from "react-router-dom";
import AlertBar, {Alert} from "../alert";

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    address: yup.string().required("Destination Address is required"),
    etd: yup.date().required(),
    eta: yup.date().required(),
});

type AddConvoiProps = {
    destination?: Destination
    googleMapsApi?: GoogleMapsApi
    onDestinationChange: (place: google.maps.places.PlaceResult | null) => void
}

type Destination = google.maps.places.PlaceResult | google.maps.GeocoderResult | null;

export default function AddConvoi({destination, googleMapsApi, onDestinationChange}: AddConvoiProps) {
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});
    const [selectedDestination, setSelectedDestination] = React.useState<Destination>();
    const {user} = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (destination) setSelectedDestination(destination);
    }, [destination])

    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            etd: new Date(),
            eta: new Date(),
        },
        validationSchema: validationSchema,
        onSubmit: async ({name, etd, eta}) => {
            const {db} = getFirebase();
            setLoading(true);
            try {
                const convoiRef = await addDoc(collection(db, `projects/${user.project}/convois`), {
                    name,
                    project: user.project,
                    etd,
                    eta,
                    destId: selectedDestination?.place_id,
                    destAddress: selectedDestination?.formatted_address,
                    destCoords: new GeoPoint(
                        selectedDestination?.geometry?.location?.lat() as number,
                        selectedDestination?.geometry?.location?.lng() as number,
                    )
                });
                setLoading(false);
                navigate(`/convoys/${convoiRef.id}`);
            } catch (e: any) {
                console.log(e)
                setLoading(false);
                setAlert({severity: 'error', message: 'Something went wrong. Please try again later.'});
            }
        },
    });

    const handleDestinationChange = (place: google.maps.places.PlaceResult | null) => {
        if (place) {
            formik.setFieldValue('address', place.formatted_address);
            setSelectedDestination(place);
            onDestinationChange(place);
        } else {
            clearDestination();
        }
    }

    const handleClick = () => {
        console.log("Clicked")
        console.log(selectedDestination)
        if (googleMapsApi && selectedDestination?.geometry?.location) {
            googleMapsApi.map.setCenter(selectedDestination.geometry.location)
        }
    }

    const clearDestination = () => {
        formik.setFieldValue('address', '');
        setSelectedDestination(null);
        onDestinationChange(null);
    }


    return (
        <React.Fragment>
            <Loading open={loading}/>
            <AlertBar {...alert} />
            <Box
                sx={{p: 2, display: 'flex', flexDirection: 'column', width: '100%'}}
                component={'form'}
                onSubmit={formik.handleSubmit}
            >
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
                    helperText={formik.touched.name && formik.errors.name && formik.errors.name}
                />
                {destination ? (
                    <Box sx={{pb: 2, pt: 1}}>
                        <Typography sx={{pb: 1}}>Destination:</Typography>
                        <Chip
                            sx={{justifyContent: 'space-between'}}
                            color="primary"
                            label={destination.formatted_address}
                            onClick={handleClick}
                            onDelete={clearDestination}
                        />
                    </Box>

                ) : (
                    <PlaceSearch
                        id="address"
                        label="Destination"
                        googleMapsApi={googleMapsApi}
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        errorMessage={formik.touched.address && formik.errors.address && formik.errors.address}
                        onChange={handleDestinationChange}
                    />
                )}
                <Box sx={{pt: 2, pb: 1}}>
                    <DateTimePicker
                        label="Estimated Time of Departure"
                        value={formik.values.etd}
                        ampm={false}
                        inputFormat={"dd.MM.yyyy HH:mm (zzz)"}
                        onChange={(value) => formik.setFieldValue('etd', value)}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth/>
                        )}
                    />
                </Box>
                <Box sx={{pt: 1, pb: 1}}>
                    <DateTimePicker
                        label="Estimated Time of Arrival"
                        value={formik.values.eta}
                        ampm={false}
                        inputFormat={"dd.MM.yyyy HH:mm (zzz)"}
                        onChange={(value) => formik.setFieldValue('eta', value)}
                        renderInput={(params) => (
                            <TextField {...params} fullWidth/>
                        )}
                    />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'flex-end', pt: 2}}>
                    <Button variant={"contained"} size="small" type="submit">Create Convoy</Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}