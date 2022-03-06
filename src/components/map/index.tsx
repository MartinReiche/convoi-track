import * as React from 'react';
import GoogleMapReact from 'google-map-react';

const Map = () => {
    const [center, setCenter] = React.useState({ lat: 52.5200 , lng: 13.4050 })
    const [zoom, setZoom] = React.useState(7);

    React.useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
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
        <div style={{height: '100vh', width: '100%'}}>
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}}
                defaultCenter={center}
                defaultZoom={zoom}
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