import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Car} from '../../utils/cars';
import Divider from "@mui/material/Divider";


export function CarCard({car}: { car: Car }) {
    return (
        <Card sx={{backgroundColor: (theme) => theme.palette.background.paper, maxWidth: '350px'}}>
            <CardContent>
                <Typography fontWeight="bold">{`${car.name} (${car.numberPlate})`}</Typography>
            </CardContent>
            <Divider />
            <CardContent>
                {car.position && (
                    <Box>
                        <Typography color="primary" component="span" fontWeight="bold">
                            Position:
                        </Typography>
                        <Typography color="text.secondary" component="span">
                            {` ${car.position.address} (${car.position.dateToString()})`}
                        </Typography>
                    </Box>
                )}
                {car.heading && (
                    <Box>
                        <Typography color="primary" component="span" fontWeight="bold">
                            Heading:
                        </Typography>
                        <Typography color="text.secondary" component="span">
                            {` ${car.heading.address} (ETA: (${car.heading.dateToString()})`}
                        </Typography>
                    </Box>
                )}
                {car.from && (
                    <Box>
                        <Typography color="primary" component="span" fontWeight="bold">
                            Von:
                        </Typography>
                        <Typography color="text.secondary" component="span">
                            {` ${car.from.address} ((${car.from.dateToString()}))`}
                        </Typography>
                    </Box>
                )}
                {car.destination && (
                    <Box>
                        <Typography color="primary" component="span" fontWeight="bold">
                            Destination:
                        </Typography>
                        <Typography color="text.secondary" component="span">
                            {` ${car.destination.address} (ETA: ${car.destination.dateToString()})`}
                        </Typography>
                    </Box>
                )}
                <CardActions>

                </CardActions>


                {/*<Box>*/}
                {/*    <Typography variant="subtitle1" color="primary" component="span" fontWeight="bold">*/}
                {/*        Arrival:*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="subtitle1" color="text.secondary" component="span">*/}
                {/*        {` ${toDateString(convoi.destination.date)}`}*/}
                {/*    </Typography>*/}
                {/*</Box>*/}
            </CardContent>
        </Card>
    );
}

export default CarCard;