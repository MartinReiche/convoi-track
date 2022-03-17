import * as React from "react";
import Map, {useMap, Destination, MapMenu, MapProvider} from "../components/map";
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
    const [addCarOpen, setAddCarOpen] = React.useState(false);
    const [mapMenuState, setMapMenuState] = React.useState<MenuState>({open: false});
    // locations
    const [convoiDestination, setConvoiDestination] = React.useState<MapLocation|null>();
    const [selectedCar, setSelectedCar] = React.useState<MapLocation|null>(null);
    const [newCarDestination, setNewCarDestination] = React.useState<MapLocation|null>();


    // API
    const {map, mapClickEvent} = useMap();
    // data listeners
    const convoi = useConvoi();
    const cars = useConvoiCars();

    React.useEffect(() => {
        if (convoi && cars && map) {
            setLoading(false);
            setConvoiDestination(convoi.destination);
            if (convoi.destination.coordinates) {
                map.setCenter({
                    lat: convoi.destination.coordinates?.latitude,
                    lng: convoi.destination.coordinates?.longitude
                });
            }
        }
    }, [convoi, cars, map]);

    React.useEffect(() => {
        if (mapClickEvent) setMapMenuState({lat: mapClickEvent.lat, lng: mapClickEvent.lng, open: true});
    }, [mapClickEvent])

    React.useEffect(() => {
        setMapMenuState({open: false});
    }, [convoiDestination, selectedCar, newCarDestination])

    React.useEffect(() => {
        setMapMenuState({open: false});
    }, [convoiDestination, selectedCar, newCarDestination])

    const handleConvoiDestinationChange = (place: MapLocation | null) => {
        if (place) {
            setConvoiDestination(place);
        } else {
            setConvoiDestination(null);
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
            <Map
                centerLocationOnLoad={true}
                drawerElements={
                    <React.Fragment>
                        {addCarOpen && (
                            <AddCar
                                convoiDestination={convoiDestination}
                                destination={newCarDestination}
                                onDestinationChange={setNewCarDestination}
                                onToggleOpen={() => setAddCarOpen(prev => !prev)}
                            />
                        )}
                        {!addCarOpen && (
                            <Cars
                                cars={cars}
                                onCarSelect={handleCarSelect}
                                onCarFocus={handleCarFocus}
                                onAddCarToggle={() => setAddCarOpen(prev => !prev)}
                            />
                        )}
                    </React.Fragment>
                }
            >
                {!!convoiDestination?.coordinates && (
                    <Destination
                        lat={convoiDestination.coordinates.latitude}
                        lng={convoiDestination.coordinates.longitude}
                    />
                )}
                {mapMenuState.open && (
                    <MapMenu
                        lat={mapMenuState.lat}
                        lng={mapMenuState.lng}
                        onSetDestination={handleConvoiDestinationChange}
                        onClose={() => setMapMenuState({open: false})}
                    />
                )}
            </Map>
        </React.Fragment>
    );
}

const ConvoiPageWithContext = () => (
    <MapProvider>
        <ConvoiPage/>
    </MapProvider>
)

export default ConvoiPageWithContext;