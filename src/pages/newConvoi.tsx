import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import AddConvoi from "../components/convois/addConvoi";
import Map, {GoogleMapsApi, MapDrawer, Destination, MapMenu} from "../components/map";

type MenuState = {
    lat?: number,
    lng?: number,
    open: boolean
}

type Place = google.maps.places.PlaceResult | google.maps.GeocoderResult | null;

const NewConvoi = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [destination, setDestination] = React.useState<Place>();
    const [mapMenuState, setMapMenuState] = React.useState<MenuState>({open: false});
    const [googleMapsApi, setGoogleMapsApi] = React.useState<GoogleMapsApi>();

    const handleMapClicked = (e: GoogleMapReact.ClickEventValue) => {
        setMapMenuState(prev => ({lat: e.lat, lng: e.lng, open: !prev.open}))
    }

    const toggleMenuOpen = () => {
        setDrawerOpen(prev => !prev);
    }

    const handleDestinationChange = (place: Place) => {
        if (place && place.geometry?.location && googleMapsApi) {
            setDestination(place);
            if (mapMenuState.open) setMapMenuState({open: false});
            googleMapsApi.map.setCenter(place.geometry.location);

        } else if (googleMapsApi) {
            setDestination(null);
        }
    }

    return (
        <React.Fragment>
            <MapDrawer open={drawerOpen} onToggleMenuOpen={toggleMenuOpen}>
                <AddConvoi
                    destination={destination}
                    googleMapsApi={googleMapsApi}
                    onDestinationChange={handleDestinationChange}
                />
            </MapDrawer>
            <Map
                onApiLoaded={setGoogleMapsApi}
                onMapClicked={handleMapClicked}
                centerLocationOnLoad={true}
            >
                {!!destination && (
                    <Destination
                        lat={destination.geometry?.location?.lat()}
                        lng={destination.geometry?.location?.lng()}
                    />
                )}
                {mapMenuState.open && (
                    <MapMenu
                        lat={mapMenuState.lat}
                        lng={mapMenuState.lng}
                        googleMapsApi={googleMapsApi}
                        onSetDestination={handleDestinationChange}
                        onClose={() => setMapMenuState({ open: false })}
                    />
                )}
            </Map>
        </React.Fragment>
    );
}

export default NewConvoi;