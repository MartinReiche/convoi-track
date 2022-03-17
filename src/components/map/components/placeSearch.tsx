import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import debounce from 'lodash.debounce'
import {GoogleMapsApi} from "../index";
import {MapLocation} from "../models";

type PlaceSearchProps = {
    id: string,
    label: string,
    googleMapsApi: GoogleMapsApi | undefined
    error: boolean | undefined,
    errorMessage: string | false | undefined,
    onChange: (place: MapLocation | null) => void,
}

type SearchResult = {
    label: string,
    place_id: string
}


export function PlaceSearch({id, label, googleMapsApi, error, errorMessage, onChange}: PlaceSearchProps) {
    const [AutoCompleteService, setAutoCompleteService] = React.useState<google.maps.places.AutocompleteService>();
    const [PlaceService, setPlaceService] = React.useState<google.maps.places.PlacesService>();
    const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);

    React.useEffect(() => {
        if (googleMapsApi) {
            // intialize AutoCompleteService & PlaceService
            setAutoCompleteService(new googleMapsApi.maps.places.AutocompleteService());
            setPlaceService(new googleMapsApi.maps.places.PlacesService(googleMapsApi.map));
        }
    }, [googleMapsApi])

    // Debounced places Prediction
    const getPlacePredictions = React.useMemo(
        () => debounce((value: string) => {
            // Callback Function for Place Prediction Change
            const onPredictionsChanged = (
                predictions: google.maps.places.AutocompletePrediction[] | null,
                status: google.maps.places.PlacesServiceStatus
            ) => {
                if (status === 'OK' && predictions) {
                    const options = predictions.map(pred => ({
                        label: pred.description,
                        place_id: pred.place_id
                    }));
                    setSearchResults(options);
                }
            }
            // Clear the Search Results if search empty; if not update place predictions
            if (value === '') {
                setSearchResults([]);
            } else {
                AutoCompleteService?.getPlacePredictions({
                    input: value,
                    types: ['establishment', 'geocode']
                }, onPredictionsChanged)
            }
        }, 500),
        [AutoCompleteService])

    const handleInputChange = (event: React.ChangeEvent<any>) => {
        setSearchResults([]);
        getPlacePredictions(event.target.value);
    }

    const handleSelectPlace = (event: React.ChangeEvent<any>, value: SearchResult | null) => {
        if (value) {
            // get place details and return results to parent
            const request = {placeId: value.place_id};
            PlaceService?.getDetails(request, (place, status) => {
                if (status === 'OK' && place?.geometry?.location) {
                    onChange(new MapLocation({
                        coordinates: place
                    }));
                }
            })
        } else {
            onChange(null);
        }
    }

    return (
        <Autocomplete
            loading={!AutoCompleteService || !PlaceService}
            disablePortal
            id="combo-box-demo"
            options={searchResults || []}
            onChange={handleSelectPlace}
            filterOptions={(options) => options}
            renderOption={(props, option) => {
                return (
                    <li {...props} key={option.place_id}>
                        {option.label}
                    </li>
                );
            }}
            renderInput={(params) => {
                return (
                    <TextField
                        {...params}
                        margin="dense"
                        id={id}
                        label={label}
                        type="string"
                        fullWidth
                        variant="outlined"
                        onChange={handleInputChange}
                        error={error}
                        helperText={errorMessage}
                    />
                )
            }}
        />
    )
}

export default PlaceSearch;