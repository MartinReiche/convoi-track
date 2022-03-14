import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import useCurrentLocation from "../../utils/useCurrentLocation";
import AlertBar, {Alert} from "../alert";
import useMapColorModeStyles from "./useMapColorModeStyles";

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {lat: 52.5200, lng: 13.4050}

export type GoogleMapsApi = {
    map: google.maps.Map
    maps: typeof google.maps
};

export type Location = {
    lat: number,
    lng: number
}

interface MapProps {
    children?: React.ReactNode
    defaultZoom?: number
    defaultCenter?: Location
    centerLocationOnLoad?: boolean
    onApiLoaded?: (api: GoogleMapsApi) => void
    onMapClicked?: (event: GoogleMapReact.ClickEventValue) => void
    onMapChanged?: (event: GoogleMapReact.ChangeEventValue) => void
    onLocationChange?: (location: Location) => void
}

const Map = (
    {
        children,
        defaultCenter=DEFAULT_CENTER,
        defaultZoom=DEFAULT_ZOOM,
        centerLocationOnLoad,
        onApiLoaded,
        onMapClicked,
        onMapChanged,
        onLocationChange,
    }: MapProps) => {
    const [googleMapsApi, setGoogleMapsApi] = React.useState<GoogleMapsApi>()
    const {location, locationError} = useCurrentLocation();
    const {mapStyles, mapBackgroundColor} = useMapColorModeStyles();
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});

    React.useEffect(() => {
        if (googleMapsApi && location) {
            if (centerLocationOnLoad) googleMapsApi.map.setCenter(location);
            if (onLocationChange) onLocationChange(location);
        }
        if (locationError) setAlert({severity: 'error', message: locationError.message});
    }, [location, locationError, googleMapsApi, onLocationChange, centerLocationOnLoad]);

    return (
        <React.Fragment>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
                    libraries: 'places',
                    language: 'en'
                }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => {
                    setGoogleMapsApi({map, maps});
                    onApiLoaded && onApiLoaded({map, maps})
                }}
                options={() => ({
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: mapStyles,
                    backgroundColor: mapBackgroundColor,
                })}
                onClick={onMapClicked}
                onChange={onMapChanged}
            >
                {React.Children.map(children, (child) => child)}
            </GoogleMapReact>
            <AlertBar {...alert} />
        </React.Fragment>
    );
}

export default Map;