import * as React from 'react';
import {GeoPoint} from "firebase/firestore";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GoogleMapReact from "google-map-react";
import {Link} from "react-router-dom";
import {Timestamp} from 'firebase/firestore';
import Goal from "../map/components/goal";

type Convoi = {
    id: string;
    name: string;
    etd: Timestamp;
    eta: Timestamp;
    to: GeoPoint;
}

const DEFAULT_ZOOM = 11;

const toDateString = (date: Timestamp) => {
    return date.toDate().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    })
}

function ConvoiCard({convoi}: { convoi: Convoi }) {
    const [address, setAddress] = React.useState<string>();


    // load Google Maps Api and reverse geocode the address of the convoi destination
    const handleApiLoaded = async (map: any, maps: any) => {
        const geoCoder = new maps.Geocoder();
        const addresses = await geoCoder.geocode({location: {lat: convoi.to.latitude, lng: convoi.to.longitude}});
        setAddress(addresses.results[0].formatted_address || '');
    }

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} sm={7} flexDirection="column" justifyContent="space-between" sx={{display: 'flex'}}>
                    <CardContent>
                        <Typography variant="h6">
                            {convoi.name}
                        </Typography>
                        {!!address && (
                            <Box>
                                <Typography variant="subtitle1" color="primary" component="span" fontWeight="bold">
                                    To:
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary" component="span">
                                    {` ${address}`}
                                </Typography>
                            </Box>
                        )}
                        <Box>
                            <Typography variant="subtitle1" color="primary" component="span" fontWeight="bold">
                                Departure:
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="span">
                                {` ${toDateString(convoi.etd)}`}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" color="primary" component="span" fontWeight="bold">
                                Arrival:
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="span">
                                {` ${toDateString(convoi.eta)}`}
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <Link to={`/convoys/${convoi.id}`} style={{textDecoration: 'none'}}>
                            <Button>Go To Convoy</Button>
                        </Link>
                    </CardActions>
                </Grid>

                <Grid item xs={12} sm={5}>
                    <CardMedia sx={{height: '100%', minHeight: 200}}>
                        <GoogleMapReact
                            bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}}
                            center={{lat: convoi.to.latitude, lng: convoi.to.longitude}}
                            zoom={DEFAULT_ZOOM}
                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
                            options={() => ({
                                zoomControl: false,
                                mapTypeControl: false,
                                scaleControl: false,
                                streetViewControl: false,
                                rotateControl: false,
                                fullscreenControl: false
                            })}
                        >
                            <Goal lat={convoi.to.latitude} lng={convoi.to.longitude} />
                        </GoogleMapReact>
                    </CardMedia>
                </Grid>
            </Grid>
        </Card>
    );
}

export default ConvoiCard;