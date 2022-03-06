import * as React from 'react';
import GoogleMapReact from 'google-map-react';
import './index.css';

const DEFAULT_LAT = 52.5200;
const DEFAULT_LNG = 13.4050;
const DEFAULT_ZOOM = 8;

const Map = () => {
    const [center, setCenter] = React.useState({ lat: DEFAULT_LAT , lng: DEFAULT_LNG })
    const [zoom, setZoom] = React.useState(DEFAULT_ZOOM);

    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                setZoom(12);
            });
        } else {
            console.log("Geolocation Not Available");
        }
    }, [])

    const handleApiLoaded = (map: any, maps: any) => {
        console.log('Maps API Loaded');
    }

    return (
        // Important! Always set the container height explicitly
        <div className="mapContainer">
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}}
                defaultCenter={{ lat: DEFAULT_LAT, lng: DEFAULT_LNG }}
                defaultZoom={DEFAULT_ZOOM}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}

            >
                {/*                <AnyReactComponent
                    lat={59.955413}
                    lng={30.337844}
                    text="My Marker"
                />*/}
            </GoogleMapReact>
        </div>
    );
}

export default Map;