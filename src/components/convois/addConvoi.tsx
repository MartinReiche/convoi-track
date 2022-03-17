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
import Chip from '@mui/material/Chip';
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import AlertBar, {Alert} from "../alert";
import {MapLocation} from "../map/models";
import {useMap} from "../map";

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    address: yup.string().required("Destination Address is required"),
    etd: yup.date().required(),
    eta: yup.date().required(),
});

type AddConvoiProps = {
    destination?: MapLocation|null
    onDestinationChange: (place: MapLocation | null) => void
}

export default function AddConvoi({destination, onDestinationChange}: AddConvoiProps) {
    const [loading, setLoading] = React.useState(false);
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});
    const [selectedDestination, setSelectedDestination] = React.useState<MapLocation|null>();
    const {user} = useAuth();
    const navigate = useNavigate();
    const {map} = useMap();

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
            if (!selectedDestination) return null
            try {
                const convoiRef = await addDoc(collection(db, `projects/${user.project}/convois`), {
                    project: user.project,
                    name,
                    destination: {
                        ...selectedDestination,
                        date: eta
                    },
                    etd,
                    createdAt: new Date(),
                });
                setLoading(false);
                navigate(`/convoys/${convoiRef.id}`);
            } catch (e: any) {
                console.error(e)
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
        if (map && selectedDestination?.coordinates) {
            map.setCenter({
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