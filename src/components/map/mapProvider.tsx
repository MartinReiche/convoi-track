import * as React from "react";
import PropTypes, {InferProps} from "prop-types";
import GoogleMapReact from "google-map-react";

const MapContext = React.createContext<{
    map: google.maps.Map | undefined,
    setMap: ((map: google.maps.Map) => void),
    maps: typeof google.maps | undefined,
    setMaps: ((maps: typeof google.maps) => void),
    mapClickEvent: GoogleMapReact.ClickEventValue | undefined,
    setMapClickEvent: ((event: GoogleMapReact.ClickEventValue) => void),
    mapChangeEvent: GoogleMapReact.ChangeEventValue | undefined,
    setMapChangeEvent: ((event: GoogleMapReact.ChangeEventValue) => void),
}>({
    map: undefined,
    setMap: () => {},
    maps: undefined,
    setMaps: () => {},
    mapClickEvent: undefined,
    setMapClickEvent: () => {},
    mapChangeEvent: undefined,
    setMapChangeEvent: () => {},
});

export const useMap = () => React.useContext(MapContext);

export function MapProvider({children}: InferProps<typeof MapProvider.propTypes>) {
    const [map, setMap] = React.useState<google.maps.Map>();
    const [maps, setMaps] = React.useState<typeof google.maps>();
    const [mapClickEvent, setMapClickEvent] = React.useState<GoogleMapReact.ClickEventValue>();
    const [mapChangeEvent, setMapChangeEvent] = React.useState<GoogleMapReact.ChangeEventValue>();

    return (
        <MapContext.Provider value={{
            map,
            setMap,
            maps,
            setMaps,
            mapClickEvent,
            setMapClickEvent,
            mapChangeEvent,
            setMapChangeEvent,
        }}>
            {children}
        </MapContext.Provider>
    )
}

MapProvider.propTypes = {
    children: PropTypes.node
}

export default MapProvider;