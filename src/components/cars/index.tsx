import * as React from 'react';
import {Car} from '../../utils/cars';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/AddCircleOutlined';
import FocusIcon from '@mui/icons-material/LocationSearching';

interface CarsProps {
    cars: Car[] | null
    onCarSelect: (car: Car) => void
    onCarFocus: (car: Car) => void
    onAddCarToggle: () => void
}

export function Cars({cars, onCarSelect, onCarFocus, onAddCarToggle}: CarsProps) {
    // const [addCarOpen, setAddCarOpen] = React.useState(false);

    if (!cars) return null;
    return (
        <List dense sx={{p: 0}}>
            {cars.map((car, index) => {
                return (
                    <ListItem
                        onClick={() => onCarSelect(car)}
                        key={index}
                        disablePadding
                        secondaryAction={
                            <IconButton onClick={(e) => {
                                e.stopPropagation();
                                onCarFocus(car);
                            }}>
                                <FocusIcon color="primary"/>
                            </IconButton>
                        }
                    >
                        <ListItemButton>
                            <Box>
                                <ListItemText primary={`${car.name} (${car.numberPlate})`}/>
                                {car.destination && (
                                    <React.Fragment>
                                        <ListItemText
                                            secondary={`To: ${car.destination.address}`}
                                            secondaryTypographyProps={{
                                                maxWidth: {xs: 'none', md: '300px'},
                                            }}
                                        />
                                        <ListItemText
                                            secondary={`ETA: ${car.destination.dateToString()}`}
                                            secondaryTypographyProps={{
                                                maxWidth: {xs: 'none', md: '300px'}
                                            }}
                                        />
                                    </React.Fragment>
                                )}
                            </Box>
                        </ListItemButton>
                    </ListItem>
                );
            })}
            <ListItem
                onClick={() => console.log("Implement add new Car")}
                disablePadding
                sx={{pt: 1, pb: 1}}
            >
                <ListItemButton onClick={onAddCarToggle}>
                    <ListItemAvatar sx={{display: 'flex', alignItems: 'center', minWidth: 0, pr: 2}}>
                        <AddIcon color="primary"/>
                    </ListItemAvatar>
                    <Box>
                        <ListItemText primary={"Add New Car"}/>
                    </Box>
                </ListItemButton>
            </ListItem>
        </List>
    )
}

export default Cars;