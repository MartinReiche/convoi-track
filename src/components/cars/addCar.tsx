import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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
import {MapLocation} from "../map/models";

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    address: yup.string().required("Destination Address is required"),
    etd: yup.date().required(),
    eta: yup.date().required(),
});

type AddCarProps = {
    destination: MapLocation | undefined
    googleMapsApi: GoogleMapsApi | undefined
    onDestinationChange: (place: MapLocation | null) => void
    onToggleOpen: () => void
}

export default function AddCar({destination, googleMapsApi, onDestinationChange, onToggleOpen}: AddCarProps) {
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});
    const [selectedDestination, setSelectedDestination] = React.useState<MapLocation|null>(null);
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
            if (!selectedDestination?.address || !selectedDestination?.coordinates) return null;
            try {
                const convoiRef = await addDoc(collection(db, `projects/${user.project}/convois`), {
                    project: user.project,
                    name,
                    destination: {
                        address: selectedDestination.address,
                        coordinates: new GeoPoint(
                            selectedDestination.coordinates.latitude,
                            selectedDestination.coordinates.longitude,
                        ),
                        date: eta,
                    },
                    etd,
                    createdAt: new Date(),
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

    const handleDestinationChange = (place: MapLocation | null) => {
        if (place) {
            formik.setFieldValue('address', place.address);
            setSelectedDestination(place);
            onDestinationChange(place);
        } else {
            clearDestination();
        }
    }

    const handleClick = () => {
        if (googleMapsApi && selectedDestination?.coordinates) {
            googleMapsApi.map.setCenter({
                lat: selectedDestination.coordinates.latitude,
                lng: selectedDestination.coordinates.longitude
            })
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
                            label={destination.address}
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
                <Box sx={{display: 'flex', justifyContent: 'flex-end', pt: 2}}>
                    <Button size="small" type="submit" onClick={onToggleOpen} sx={{ mr: 2}}>Cancel</Button>
                    <Button variant={"contained"} size="small" type="submit">Add Car</Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}