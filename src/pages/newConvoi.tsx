import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import AddConvoi from "../components/convois/addConvoi";
import Map, {GoogleMapsApi, MapDrawer, Destination, MapMenu} from "../components/map";
import {MapLocation} from "../components/map/models";

type MenuState = {
    lat?: number,
    lng?: number,
    open: boolean
}


const NewConvoi = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [destination, setDestination] = React.useState<MapLocation|null>();
    const [mapMenuState, setMapMenuState] = React.useState<MenuState>({open: false});
    const [googleMapsApi, setGoogleMapsApi] = React.useState<GoogleMapsApi>();

    const handleMapClicked = (e: GoogleMapReact.ClickEventValue) => {
        setMapMenuState(prev => ({lat: e.lat, lng: e.lng, open: !prev.open}))
    }

    const toggleMenuOpen = () => {
        setDrawerOpen(prev => !prev);
    }

    const handleDestinationChange = (place: MapLocation|null) => {
        if (place && place.coordinates && googleMapsApi) {
            setDestination(place);
            if (mapMenuState.open) setMapMenuState({open: false});
            googleMapsApi.map.setCenter({lat: place.coordinates.latitude, lng: place.coordinates.longitude});

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
                {!!destination?.coordinates && (
                    <Destination
                        lat={destination.coordinates.latitude}
                        lng={destination.coordinates.longitude}
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