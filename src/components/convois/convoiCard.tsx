import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {Link} from "react-router-dom";
import {Timestamp} from 'firebase/firestore';
import Goal from "../map/components/goal";
import Map, {GoogleMapsApi} from "../map";
import { Convoi } from '.';

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
    // const [address, setAddress] = React.useState<string>();
    const [googleMapsApi, setGoogleMapsApi] = React.useState<GoogleMapsApi>();

    React.useEffect(() => {
        if (googleMapsApi) {
           googleMapsApi.map.setCenter({
               lat: convoi.destCoords.latitude,
               lng: convoi.destCoords.longitude
           })
        }
    }, [googleMapsApi, convoi.destCoords])

    return (
        <Card>
            <Grid container>
                <Grid item xs={12} sm={7} flexDirection="column" justifyContent="space-between" sx={{display: 'flex'}}>
                    <CardContent>
                        <Typography variant="h6">
                            {convoi.name}
                        </Typography>
                        <Box>
                            <Typography variant="subtitle1" color="primary" component="span" fontWeight="bold">
                                To:
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="span">
                                {` ${convoi.destAddress}`}
                            </Typography>
                        </Box>
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
                        <Map
                            defaultZoom={DEFAULT_ZOOM}
                            onApiLoaded={setGoogleMapsApi}
                        >
                            <Goal lat={convoi.destCoords.latitude} lng={convoi.destCoords.longitude}/>
                        </Map>
                    </CardMedia>
                </Grid>
            </Grid>
        </Card>
    );
}

export default ConvoiCard;