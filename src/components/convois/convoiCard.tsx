import * as React from 'react';
import {GeoPoint} from "firebase/firestore";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GoogleMapReact from "google-map-react";
import MarkerIcon from '@mui/icons-material/Room';
import PropTypes from "prop-types";

type Convoi = {
    id: string;
    name: string;
    etd: Date;
    eta: Date;
    to: GeoPoint;
}

const DEFAULT_ZOOM = 11;


const Marker = () => (
    <MarkerIcon color="primary" sx={{fontSize: 40 ,transform: 'translate(-50%,-100%)'}}/>
)

Marker.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number,
}

function ConvoiCard({convoi}: {convoi: Convoi}) {
    const [address, setAddress] = React.useState<string>();


    // load Google Maps Api and reverse geocode the address of the convoi destination
    const handleApiLoaded = async (map: any, maps: any) => {
        const geoCoder = new maps.Geocoder();
        const addresses = await geoCoder.geocode({location: {lat: convoi.to.latitude, lng: convoi.to.longitude}});
        setAddress(addresses.results[0].formatted_address || '');
    }

    return (
        <Card sx={(theme) => ({background: theme.palette.primary.main, display: 'flex'})}>
            <Grid container sx={{flexDirection: {xs: 'column', sm: 'row'}}}>
                <Grid item xs={7}>
                    <CardContent sx={{flex: '1 0 auto'}}>
                        <Typography component="div" variant="h6">
                            {convoi.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {!!address && `To: ${address}`}
                        </Typography>
                    </CardContent>
                </Grid>

                <Grid item xs={5}>
                    <CardMedia sx={{height: 200}}>
                        <GoogleMapReact
                            bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}}
                            center={{lat: convoi.to.latitude, lng: convoi.to.longitude}}
                            zoom={DEFAULT_ZOOM}
                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
                            options={(maps) => ({
                                zoomControl: false,
                                mapTypeControl: false,
                                scaleControl: false,
                                streetViewControl: false,
                                rotateControl: false,
                                fullscreenControl: false
                            })}
                        >
                            <Marker
                                lat={convoi.to.latitude}
                                lng={convoi.to.longitude}
                            />
                        </GoogleMapReact>
                    </CardMedia>
                </Grid>
            </Grid>
        </Card>
    );
}

export default ConvoiCard;