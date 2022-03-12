import {useState, useEffect} from 'react';

export type Location = {
    lat: number
    lng: number
    accuracy: number
    speed: number | null
    heading: number | null
}

function useCurrentLocation() {
    const [location, setLocation] = useState<Location>();
    const [locationError, setLocationError] = useState<GeolocationPositionError | Error>()

    useEffect(() => {
        if ("geolocation" in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        accuracy: pos.coords.accuracy,
                        speed: pos.coords.speed,
                        heading: pos.coords.heading,
                    })
                },
                () => {
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