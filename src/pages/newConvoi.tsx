import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import AddConvoi from "../components/convois/addConvoi";
import Destination from "../components/map/components/goal";
import MapMenu from "../components/map/mapMenu";
import Map, {GoogleMapsApi, Location} from "../components/map";

const DEFAULT_ZOOM = 13;
const DEFAULT_CENTER = {lat: 52.5200, lng: 13.4050}

type MenuState = {
    lat?: number,
    lng?: number,
    open: boolean
}

const NewConvoi = () => {
    const [open, setOpen] = React.useState(true);
    const [location, setLocation] = React.useState<Location>();
    const [destination, setDestination] = React.useState<google.maps.places.PlaceResult|null>()
    const [menuState, setMenuState] = React.useState<MenuState>({open: false});
    const [googleMapsApi, setGoogleMapsApi] = React.useState<GoogleMapsApi>()

    React.useEffect(() => {})

    const handleMapClicked = (e: GoogleMapReact.ClickEventValue) => {
        setMenuState(prev => ({lat: e.lat, lng: e.lng, open: !prev.open}))
    }

    const toggleMenuOpen = () => {
        setOpen(prev => !prev);
    }

    const handleDestinationChange = (place: google.maps.places.PlaceResult | null) => {
        if (place && place.geometry?.location && googleMapsApi) {
            setDestination(place);
            googleMapsApi.map.setCenter(place.geometry.location);
            googleMapsApi.map.setZoom(17);
        } else if (googleMapsApi) {
            setDestination(null);
            if (location) googleMapsApi.map.setCenter({lat: location.lat, lng: location.lng});
            else googleMapsApi.map.setCenter(DEFAULT_CENTER);
            googleMapsApi.map.setZoom(DEFAULT_ZOOM);
        }
    }

    return (
        <React.Fragment>
            <MapMenu open={open} onToggleMenuOpen={toggleMenuOpen}>
                <AddConvoi googleMapsApi={googleMapsApi} onDestinationChange={handleDestinationChange} />
            </MapMenu>
            <Map
                onApiLoaded={setGoogleMapsApi}
                onMapClicked={handleMapClicked}
                onLocationChange={setLocation}
                centerLocationOnLoad={true}
            >
                {!!destination && (
                    <Destination
                        lat={destination.geometry?.location?.lat()}
                        lng={destination.geometry?.location?.lng()}
                    />
                )}
                {menuState.open && <Destination lat={menuState.lat} lng={menuState.lng}/>}
            </Map>
        </React.Fragment>
    );
}

export default NewConvoi;