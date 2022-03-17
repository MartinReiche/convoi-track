import {useState, useEffect} from 'react';
import {MapLocation} from "../components/map/models";

function useCurrentLocation() {
    const [location, setLocation] = useState<MapLocation>();
    const [locationError, setLocationError] = useState<GeolocationPositionError | Error>()

    useEffect(() => {
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setLocation(new MapLocation({
                        coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude}}))
                },
                (e) => {
                    console.log(e)
                    setLocationError(new Error("Could not get your location. Check if the browser blocks geolocation"));
                })
            return function cleanUp() {
                navigator.geolocation.clearWatch(watchId)
            }
        } else {
            setLocationError(new Error("Geolocation Not Available"))
        }
    }, []);

    useEffect(() => {
        navigator.permissions.query({name: 'geolocation'}).then(result => {
            if (result.state === 'denied') {
                setLocationError(new Error("Geolocation is blocked by the browser."))
            }
        }).catch(() => {
            setLocationError(new Error("Geolocation Not Available"))
        })
    }, []);

    return {location, locationError};
}

export default useCurrentLocation;