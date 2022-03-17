import * as React from 'react';
import AddConvoi from "../components/convois/addConvoi";
import Map, {MapProvider, Destination, MapMenu, useMap} from "../components/map";
import {MapLocation} from "../components/map/models";

type MenuState = {
    lat?: number,
    lng?: number,
    open: boolean
}

const NewConvoi = () => {
    const [destination, setDestination] = React.useState<MapLocation | null>();
    const [mapMenuState, setMapMenuState] = React.useState<MenuState>({open: false});
    const {map, mapClickEvent} = useMap();

    React.useEffect(() => {
        if (mapClickEvent) setMapMenuState({lat: mapClickEvent.lat, lng: mapClickEvent.lng, open: true});
    }, [mapClickEvent])

    const handleDestinationChange = (place: MapLocation | null) => {
        if (place && place.coordinates && map) {
            setDestination(place);
            if (mapMenuState.open) setMapMenuState({open: false});
            map.setCenter({lat: place.coordinates.latitude, lng: place.coordinates.longitude});

        } else if (map) {
            setDestination(null);
        }
    }

    return (
        <React.Fragment>
            <Map
                centerLocationOnLoad={true}
                drawerElements={
                    <AddConvoi
                        destination={destination}
                        onDestinationChange={handleDestinationChange}
                    />
                }
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
                        onSetDestination={handleDestinationChange}
                        onClose={() => setMapMenuState({open: false})}
                    />
                )}
            </Map>
        </React.Fragment>
    );
}

const NewConvoiWithProvider = () => (
    <MapProvider>
        <NewConvoi/>
    </MapProvider>
)

export default NewConvoiWithProvider;