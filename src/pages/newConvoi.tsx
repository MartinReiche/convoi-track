import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import useCurrentLocation from "../utils/useCurrentLocation";
import AlertBar, {Alert} from "../components/alert";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import MapMarker from "../components/map/mapMarker";
import AddConvoi from "../components/convois/addConvoi";

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {lat: 52.5200, lng: 13.4050}

const NewConvoi = () => {
    const [center, setCenter] = React.useState(DEFAULT_CENTER);
    const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);
    const [apiLoaded, setApiLoaded] = React.useState(false);
    const {location, locationError} = useCurrentLocation();
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});

    React.useEffect(() => {
        if (apiLoaded && location) {
            setCenter({lat: location.lat, lng: location.lng});
        }
        if (locationError) setAlert({severity: 'error', message: locationError.message});
    }, [location, locationError, apiLoaded]);

    const handleApiLoaded = (map: any, maps: any) => {
        setApiLoaded(true);
    }

    const handleMapChange = (e: GoogleMapReact.ChangeEventValue) => {
        // console.log(e);
    }

    return (
        <React.Fragment>
            <AddConvoi/>
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}}
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
                })}
                onChange={handleMapChange}
            >
                {!!location && (
                    <MapMarker lat={location.lat} lng={location.lng}>
                        <MyLocationIcon color="error" sx={{fontSize: 30}}/>
                    </MapMarker>
                )}
            </GoogleMapReact>
            <AlertBar {...alert} />
        </React.Fragment>
    );
}

export default NewConvoi;