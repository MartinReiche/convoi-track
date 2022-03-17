import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import useCurrentLocation from "../../../utils/useCurrentLocation";
import AlertBar, {Alert} from "../../alert";
import useMapColorModeStyles from "../useMapColorModeStyles";
import {MapLocation} from "../models";
import {useMap} from "../mapProvider";

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {lat: 52.5200, lng: 13.4050}

export type GoogleMapsApi = {
    map: google.maps.Map
    maps: typeof google.maps
};

export interface MapProps {
    children?: React.ReactNode
    defaultZoom?: number
    defaultCenter?: MapLocation
    centerLocationOnLoad?: boolean
    onLocationChange?: (location: MapLocation) => void
}

const Map = ({
        children,
        defaultCenter=new MapLocation({coordinates: DEFAULT_CENTER}),
        defaultZoom=DEFAULT_ZOOM,
        centerLocationOnLoad,
        onLocationChange,
    }: MapProps) => {
    const [alert, setAlert] = React.useState<Alert>({severity: 'info', message: null});
    const [centeredInitially, setCenteredInitially] = React.useState(false);
    const {location, locationError} = useCurrentLocation();
    const {mapStyles, mapBackgroundColor} = useMapColorModeStyles();
    const {setMap,map,setMaps,setMapClickEvent,setMapChangeEvent} = useMap();

    React.useEffect(() => {
        if (map && location) {
            if (!centeredInitially && centerLocationOnLoad && location.coordinates) {
                map.setCenter({
                    lat: location.coordinates.latitude,
                    lng: location.coordinates.longitude
                });
                setCenteredInitially(true)
            }
            if (onLocationChange) onLocationChange(location);
        }
        if (locationError) setAlert({severity: 'error', message: locationError.message});
    }, [location, locationError, map, onLocationChange, centerLocationOnLoad, centeredInitially]);

    return (
        <React.Fragment>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
                    libraries: 'places',
                    language: 'en'
                }}
                defaultCenter={defaultCenter?.coordinates && { lat: defaultCenter?.coordinates.latitude, lng: defaultCenter?.coordinates.longitude }}
                defaultZoom={defaultZoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => {
                    setMap(map);
                    setMaps(maps);
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
                onClick={setMapClickEvent}
                onChange={setMapChangeEvent}
            >
                {React.Children.map(children, (child) => child)}
            </GoogleMapReact>
            <AlertBar {...alert} />
        </React.Fragment>
    );
}

export default Map;
