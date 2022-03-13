import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import useCurrentLocation from "../utils/useCurrentLocation";
import AlertBar, {Alert} from "../components/alert";
import AddConvoi from "../components/convois/addConvoi";
import useMapColorModeStyles from "../components/map/useMapColorModeStyles";
import Destination from "../components/map/components/goal";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import ArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import Drawer from '@mui/material/Drawer';

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {lat: 52.5200, lng: 13.4050}

const NewConvoi = () => {
    const [open, setOpen] = React.useState(true);
    const [center, setCenter] = React.useState(DEFAULT_CENTER);
    const [zoom] = React.useState(DEFAULT_ZOOM);
    const [apiLoaded, setApiLoaded] = React.useState(false);
    const [map, setMap] = React.useState<google.maps.Map>();
    const [mapApi, setMapApi] = React.useState<typeof google.maps>();
    const [destination, setDestination] = React.useState<google.maps.places.PlaceResult|null>()

    const {location, locationError} = useCurrentLocation();
    const {mapStyles, mapBackgroundColor} = useMapColorModeStyles();
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});

    React.useEffect(() => {
        if (apiLoaded && location) {
            setCenter({lat: location.lat, lng: location.lng});
        }
        if (locationError) setAlert({severity: 'error', message: locationError.message});
    }, [location, locationError, apiLoaded]);

    const handleApiLoaded = (map: google.maps.Map, maps: typeof google.maps) => {
        setApiLoaded(true);
        setMap(map);
        setMapApi(maps);
    }

    // const handleMapChange = (e: GoogleMapReact.ChangeEventValue) => {
    //     // console.log(e);
    // }

    const toggleMenuOpen = () => {
        setOpen(prev => !prev);
    }

    const handleDestinationChange = (place: google.maps.places.PlaceResult | null) => {
        if (place && place.geometry?.location) {
            setDestination(place);
            map?.setCenter(place.geometry.location);
            map?.setZoom(17);
        } else {
            console.log("CLEAR PARENT")
            setDestination(null);
            if (location) map?.setCenter({lat: location.lat, lng: location.lng});
            else map?.setCenter(DEFAULT_CENTER);
            map?.setZoom(DEFAULT_ZOOM);
        }
    }

    return (
        <React.Fragment>
            <Drawer
                open={open}
                hideBackdrop={true}
                variant="persistent"
            >
                <Box sx={{pt: '74px', position: 'relative'}}>
                    <AddConvoi map={map} mapApi={mapApi} onDestinationChange={handleDestinationChange} />
                </Box>
            </Drawer>
            <Box sx={{position: 'absolute', bottom: 40, left: 10, zIndex: (theme) => theme.zIndex.drawer}}>
                <Fab onClick={toggleMenuOpen} color="primary">
                    {open ?
                        <ArrowLeftIcon sx={{fontSize: 40}}/>
                        : <ArrowRightIcon sx={{fontSize: 40}}/>
                    }
                </Fab>
            </Box>
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '', libraries: 'places', language: 'en'}}
                center={center}
                zoom={zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
                options={() => ({
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: mapStyles,
                    backgroundColor: mapBackgroundColor
                })}
                // onChange={handleMapChange}
            >
                {!!destination && (
                    <Destination
                        lat={destination.geometry?.location?.lat()}
                        lng={destination.geometry?.location?.lng()}
                    />
                )}
                {/*{!!location && (<MyLocation lat={location.lat} lng={location.lng}/>)}*/}
            </GoogleMapReact>
            <AlertBar {...alert} />
        </React.Fragment>
    );
}

export default NewConvoi;