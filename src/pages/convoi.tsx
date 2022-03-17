import * as React from "react";
import GoogleMapReact from 'google-map-react';
import Map, {GoogleMapsApi, MapDrawer, Destination, MapMenu} from "../components/map";
import Loading from "../components/loading";
import {useConvoi} from "../utils/convois";
import {useConvoiCars} from "../utils/cars";
import Cars from '../components/cars';
import {Car} from '../utils/cars';
import {MapLocation} from "../components/map/models";
import AddCar from "../components/cars/addCar";

type MenuState = {
    lat?: number,
    lng?: number,
    open: boolean
}

const ConvoiPage = () => {
    // UI state
    const [loading, setLoading] = React.useState(true);
    const [drawerOpen, setDrawerOpen] = React.useState(true);
    const [addCarOpen, setAddCarOpen] = React.useState(false);
    const [mapMenuState, setMapMenuState] = React.useState<MenuState>({open: false});
    // locations
    const [destination, setDestination] = React.useState<MapLocation|null>();
    const [convoiDestination, setConvoiDestination] = React.useState<MapLocation>();

    // API
    const [googleMapsApi, setGoogleMapsApi] = React.useState<GoogleMapsApi>();
    // data listeners
    const convoi = useConvoi();
    const cars = useConvoiCars();

    React.useEffect(() => {
            if (convoi && cars && googleMapsApi) {
                setLoading(false);
                setConvoiDestination(convoi.destination);
                if (convoi.destination.coordinates) {
                    googleMapsApi.map.setCenter({
                        lat: convoi.destination.coordinates?.latitude,
                        lng: convoi.destination.coordinates?.longitude
                    });
                }
            }
        }, [convoi, cars, googleMapsApi]);

    const handleMapClicked = (e: GoogleMapReact.ClickEventValue) => {
        setMapMenuState({lat: e.lat, lng: e.lng, open: true});
    }

    const toggleMenuOpen = () => {
        setDrawerOpen(prev => !prev);
    }

    const handleDestinationChange = (place: MapLocation|null) => {
        if (place && place.coordinates && googleMapsApi) {
            setDestination(place);
            setMapMenuState({open: false});
            googleMapsApi.map.setCenter({lat: place.coordinates.latitude, lng: place.coordinates.longitude});

        } else if (googleMapsApi) {
            setDestination(null);
        }
    }

    const handleCarSelect = (car: Car) => {
        console.log("selected Car");
        console.log(car);
    }

    const handleCarFocus = (car: Car) => {
        console.log("Focus Car on MAp");
        console.log(car);
    }

    return (
        <React.Fragment>
            <Loading open={loading}/>
            <MapDrawer open={drawerOpen} onToggleMenuOpen={toggleMenuOpen}>
                {addCarOpen ? (
                    <AddCar
                        destination={convoiDestination}
                        googleMapsApi={googleMapsApi}
                        onDestinationChange={handleDestinationChange}
                        onToggleOpen={() => setAddCarOpen(prev => !prev)}
                    />
                ) : (
                    <Cars
                        cars={cars}
                        onCarSelect={handleCarSelect}
                        onCarFocus={handleCarFocus}
                        onAddCarToggle={() => setAddCarOpen(prev => !prev)}
                    />
                )}
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
                        onClose={() => setMapMenuState({open: false})}
                    />
                )}
            </Map>
        </React.Fragment>
    );
}

export default ConvoiPage;