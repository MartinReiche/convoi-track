import * as React from 'react';
import {useMap, MapProvider} from "../components/map/mapProvider";
import Map from '../components/map/lab';


function MapProviderTest() {
    const {mapClickEvent} = useMap();

    React.useEffect(() => {
        console.log("clicked Map", mapClickEvent);
    },[mapClickEvent])

    return (
        <React.Fragment>
            <Map>

            </Map>
        </React.Fragment>
    )
}

export default function MapWithContext() {
    return (
        <MapProvider>
            <MapProviderTest />
        </MapProvider>
    )
}