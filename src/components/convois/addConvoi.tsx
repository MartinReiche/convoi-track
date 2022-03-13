import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/MobileDateTimePicker';
import * as yup from "yup";
import {useFormik} from "formik";
// import getFirebase from "../../utils/getFirebase";
// import {addDoc, collection} from "firebase/firestore";
// import {useAuth} from "../auth/authProvider";
import Box from '@mui/material/Box';
import PlaceSearch from "../map/placeSearch";
import Loading from '../loading';


const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    address: yup.string().required("Destination Address is required"),
    etd: yup.date().required(),
    eta: yup.date().required(),
});

type AddConvoiProps = {
    map: google.maps.Map | undefined,
    mapApi: typeof google.maps | undefined,
    onDestinationChange: (place: google.maps.places.PlaceResult | null) => void
}

export default function AddConvoi({mapApi, map, onDestinationChange}: AddConvoiProps) {
    const [loading] = React.useState(false);
    // const {user} = useAuth();
    const [destination, setDestination] = React.useState<google.maps.places.PlaceResult | null>();


    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            etd: new Date(),
            eta: new Date(),
        },
        validationSchema: validationSchema,
        onSubmit: async ({address, name, etd, eta}) => {
            console.log("name", name)
            console.log("address", address)
            console.log("etd", etd)
            console.log("eta", eta)
            console.log("place name", destination?.name)
            console.log("place id", destination?.place_id)
            console.log("place lat", destination?.geometry?.location?.lat())
            console.log("place lng", destination?.geometry?.location?.lng())
            // const {db} = getFirebase();
            // // setLoading(true);
            // try {
            //     await addDoc(collection(db, `projects/${user.project}/addOrgaRequest`), {
            //         name,
            //         destination,
            //         host: window.location.protocol + '//' + window.location.host + '/',
            //     });
            // } catch (e: any) {
            //     // setLoading(false);
            //     // setAlert({ severity: 'error', message: 'Something went wrong. Please try again later.'});
            // }
        },
    });

    const handleDestinationChange = (place: google.maps.places.PlaceResult | null) => {
        if (place) {
            formik.setFieldValue('address', place.formatted_address);
            setDestination(place);
            onDestinationChange(place);
        } else {
            formik.setFieldValue('address', '');
            setDestination(null);
            onDestinationChange(null);
        }
    }

    return (
        <React.Fragment>
            <Loading open={loading}/>
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
                <PlaceSearch
                    id="address"
                    label="Destination"
                    map={map}
                    mapApi={mapApi}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    errorMessage={formik.touched.address && formik.errors.address && formik.errors.address}
                    onChange={handleDestinationChange}
                />
                <Box sx={{pt: 4, pb: 1}}>
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