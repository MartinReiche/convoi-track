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
import Chip from '@mui/material/Chip';
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";
import AlertBar, {Alert} from "../alert";
import {MapLocation} from "../map/models";
import {useMap} from "../map";
import DateTimePicker from "@mui/lab/MobileDateTimePicker";

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    address: yup.string().required("Destination Address is required"),
    numberPlate: yup.string().required('Numberplate is required'),
    freeSeats: yup.number().required('Number of free seats is required'),
    eta: yup.date().required(),
});

type AddCarProps = {
    destination: MapLocation | undefined | null
    convoiDestination: MapLocation | undefined | null
    onDestinationChange: (location: MapLocation | null) => void
    onToggleOpen: () => void
}

export default function AddCar({destination, convoiDestination, onDestinationChange, onToggleOpen}: AddCarProps) {
    const [pristine, setPristine] = React.useState(true);
    const [currentDestination, setCurrentDestination] = React.useState<MapLocation | null>();
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});
    const {user} = useAuth();
    const {map} = useMap();
    const params = useParams();

    React.useEffect(() => {
        console.log("setCurrentDest")
        if (pristine) setCurrentDestination(convoiDestination);
        else setCurrentDestination(destination);
    }, [pristine, convoiDestination, destination])

    const formik = useFormik({
        initialValues: {
            name: '',
            address: convoiDestination?.address,
            numberPlate: '',
            freeSeats: 0,
            eta: convoiDestination?.date?.toDate() || new Date(),
        },
        validationSchema: validationSchema,
        onSubmit: async ({name, eta, numberPlate, freeSeats}) => {
            const {db} = getFirebase();
            setLoading(true);
            if (!currentDestination?.address || !currentDestination?.coordinates) return null;
            try {
                await addDoc(collection(db, `projects/${user.project}/convois/${params.id}/cars`), {
                    project: user.project,
                    name,
                    eta,
                    numberPlate,
                    freeSeats,
                    destination: {
                        ...currentDestination,
                        date: eta,
                    },
                    createdAt: new Date(),
                });
                setLoading(false);
                onToggleOpen();
            } catch (e: any) {
                console.log(e)
                setLoading(false);
                setAlert({severity: 'error', message: 'Something went wrong. Please try again later.'});
            }
        },
    });

    const handleDestinationChange = (location: MapLocation | null) => {
        if (location) {
            formik.setFieldValue('address', location.address);
            onDestinationChange(location);
            if (location.coordinates?.latitude && location.coordinates?.longitude) {
                map?.setCenter({
                    lat: location.coordinates?.latitude,
                    lng: location.coordinates?.longitude
                })
            }
        } else {
            clearDestination();
        }
    }

    const handleClick = () => {
        if (map && currentDestination?.coordinates) {
            map.setCenter({
                lat: currentDestination.coordinates.latitude,
                lng: currentDestination.coordinates.longitude
            })
        }
    }

    const clearDestination = () => {
        formik.setFieldValue('address', '')
        setPristine(false);
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
                <TextField
                    autoFocus
                    margin="dense"
                    id="numberPlate"
                    label="Numberplate"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formik.values.numberPlate}
                    onChange={formik.handleChange}
                    error={formik.touched.numberPlate && Boolean(formik.errors.numberPlate)}
                    helperText={formik.touched.numberPlate && formik.errors.numberPlate && formik.errors.numberPlate}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="freeSeats"
                    label="Number of free seats"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={formik.values.freeSeats}
                    onChange={formik.handleChange}
                    error={formik.touched.freeSeats && Boolean(formik.errors.freeSeats)}
                    helperText={formik.touched.freeSeats && formik.errors.freeSeats && formik.errors.freeSeats}
                />
                <Box sx={{pb: 2, pt: 1, display: currentDestination ? 'block' : 'none'}}>
                    <Typography sx={{pb: 1}}>Destination:</Typography>
                    <Chip
                        sx={{justifyContent: 'space-between'}}
                        color="primary"
                        label={pristine ? convoiDestination?.address : destination?.address}
                        onClick={handleClick}
                        onDelete={clearDestination}
                    />
                </Box>
                <Box sx={{display: currentDestination ? 'none' : 'block'}}>
                    <PlaceSearch
                        id="address"
                        label="Destination"
                        error={formik.touched.address && Boolean(formik.errors.address)}
                        errorMessage={formik.touched.address && formik.errors.address && formik.errors.address}
                        onChange={handleDestinationChange}
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
                    <Button size="small" type="submit" onClick={onToggleOpen} sx={{mr: 2}}>Cancel</Button>
                    <Button variant={"contained"} size="small" type="submit">Add Car</Button>
                </Box>
            </Box>
        </React.Fragment>
    );
}