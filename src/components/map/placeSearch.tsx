import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from "@mui/material/TextField";
import debounce from 'lodash.debounce'

type PlaceSearchProps = {
    id: string,
    label: string,
    map: google.maps.Map | undefined,
    mapApi: typeof google.maps | undefined,
    error: boolean | undefined,
    errorMessage: string | false | undefined,
    onChange: (place: google.maps.places.PlaceResult | null) => void,
}

type SearchResults = {
    label: string,
    place_id: string
}

export default function PlaceSearch({id, label, mapApi, map, error, errorMessage, onChange}: PlaceSearchProps) {
    const [AutoCompleteService, setAutoCompleteService] = React.useState<google.maps.places.AutocompleteService>();
    const [PlaceService, setPlaceService] = React.useState<google.maps.places.PlacesService>();
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<SearchResults[]>([]);

    React.useEffect(() => {
        if (mapApi && map) {
            // intialize AutoCompleteService
            setAutoCompleteService(new mapApi.places.AutocompleteService());
            setPlaceService(new mapApi.places.PlacesService(map));
        }
    }, [mapApi, map])

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
        setSearch(event.target.value);
        getPlacePredictions(event.target.value);
    }

    const handleSelectPlace = (event: React.ChangeEvent<any>, value: SearchResults | null) => {
        if (value) {
            // get place details and return reuls to parent
            const request = {placeId: value.place_id};
            PlaceService?.getDetails(request, (place, status) => {
                if (status === 'OK' && place?.geometry?.location) onChange(place);
            })
        } else {
            onChange(null);
        }
    }

    return (
        <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={searchResults || []}
            sx={{width: 300}}
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
                        value={search}
                        onChange={handleInputChange}
                        error={error}
                        helperText={errorMessage}
                    />
                )
            }}
        />
    )
}