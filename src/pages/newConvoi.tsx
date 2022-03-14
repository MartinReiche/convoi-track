import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import useCurrentLocation from "../utils/useCurrentLocation";
import AlertBar, {Alert} from "../components/alert";
import AddConvoi from "../components/convois/addConvoi";
import useMapColorModeStyles from "../components/map/useMapColorModeStyles";
import Destination from "../components/map/components/goal";
import MapMenu from "../components/map/mapMenu";

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {lat: 52.5200, lng: 13.4050}

type MenuState = {
    lat?: number,
    lng?: number,
    open: boolean
}

const NewConvoi = () => {
    const [open, setOpen] = React.useState(true);
    const [center, setCenter] = React.useState(DEFAULT_CENTER);
    const [zoom] = React.useState(DEFAULT_ZOOM);
    const [apiLoaded, setApiLoaded] = React.useState(false);
    const [map, setMap] = React.useState<google.maps.Map>();
    const [mapApi, setMapApi] = React.useState<typeof google.maps>();
    const [destination, setDestination] = React.useState<google.maps.places.PlaceResult|null>()
    const [menuState, setMenuState] = React.useState<MenuState>({open: false});

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
        // map.addListener("click", handleMapClicked)
    }

    const handleMapClicked = (e: GoogleMapReact.ClickEventValue) => {
        setMenuState(prev => ({lat: e.lat, lng: e.lng, open: !prev.open}))
    }

    const toggleMenuOpen = () => {
        setOpen(prev => !prev);
    }

    const handleDestinationChange = (place: google.maps.places.PlaceResult | null) => {
        if (place && place.geometry?.location) {
            setDestination(place);
            map?.setCenter(place.geometry.location);
            map?.setZoom(17);
        } else {
            setDestination(null);
            if (location) map?.setCenter({lat: location.lat, lng: location.lng});
            else map?.setCenter(DEFAULT_CENTER);
            map?.setZoom(DEFAULT_ZOOM);
        }
    }

    return (
        <React.Fragment>
            <MapMenu open={open} onToggleMenuOpen={toggleMenuOpen}>
                <AddConvoi map={map} mapApi={mapApi} onDestinationChange={handleDestinationChange} />
            </MapMenu>
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
                    backgroundColor: mapBackgroundColor,
                })}
                onClick={handleMapClicked}
            >
                {!!destination && (
                    <Destination
                        lat={destination.geometry?.location?.lat()}
                        lng={destination.geometry?.location?.lng()}
                    />
                )}
                {menuState.open && <Destination lat={menuState.lat} lng={menuState.lng}/>}
            </GoogleMapReact>
            <AlertBar {...alert} />
        </React.Fragment>
    );
}

export default NewConvoi;