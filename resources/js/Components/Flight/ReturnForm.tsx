import React, { useState, useEffect } from 'react';
import {
    TextField,
    CircularProgress,
    Autocomplete, Box,
    Typography
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useForm } from "@inertiajs/react";
import { useGetAirportsQuery } from "@/toolkit/services/flight";
import FlightIcon from '@mui/icons-material/Flight';
import parse from 'autosuggest-highlight/parse';
import { debounce } from '@mui/material/utils';

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.
const GOOGLE_MAPS_API_KEY = 'AIzaSyC3aviU6KHXAjoSnxcw6qbOhjnFctbxPkE';
function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };
interface MainTextMatchedSubstrings {
    offset: number;
    length: number;
}
interface StructuredFormatting {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
    description: string;
    structured_formatting: StructuredFormatting;
}
export const ReturnForm = (props:any) => {
    const [value, setValue] = React.useState<PlaceType | null>(null);
    const [keyword, setKeyword] = useState<string>('');
    const loaded = React.useRef(false);
    const [open, setOpen] = React.useState(false);
    const [start, setStart] = useState(false);
    const [options, setOptions] = React.useState<readonly any[]>([]);   // airport or city option lists
    // const { data, setData, post, processing, errors, reset } = useForm({
    //     originLocationCode: '',
    //     destinationLocationCode: '',
    //     departureDate: '',
    //     adults: 1,
    //
    // });

    const {data, error, isLoading, isFetching} = useGetAirportsQuery(keyword, { skip: !keyword, refetchOnMountOrArgChange: true });
    // const [loading, setLoading] = React.useState(isLoading);
    useEffect(() => {
        if(data) {
            const formattedOptions = data.map((location: any) => ({
                label: `${location.name} (${location.iataCode}) - ${location.subType}`,
                value: location.iataCode,
            }));
            setOptions(formattedOptions);
            setStart(false);
        }
    }, [data])

    const fetch = React.useMemo(
        () =>
            debounce(
                (
                    request: { input: string },
                    callback: (results?: readonly PlaceType[]) => void,
                ) => {
                    setStart(true);
                },
                500,
            ),
        [],
    );

    useEffect(() => {
        let active = true;
        if (keyword === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: keyword }, (results?: readonly PlaceType[]) => {
            if (active) {
                let newOptions: readonly PlaceType[] = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, keyword, fetch]);

    const submit = async () => {

    }

    return (
        <form onSubmit={submit}>
            <Grid container spacing={2}>
                <Grid size={3}>
                    <Autocomplete
                        fullWidth
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.label
                        }
                        filterOptions={(x) => x}
                        options={options}
                        loading={isFetching}
                        autoComplete
                        includeInputInList
                        filterSelectedOptions
                        value={value}
                        noOptionsText="No locations"
                        onChange={(event: any, newValue: PlaceType | null) => {
                            setOptions(newValue ? [newValue, ...options] : options);
                            setValue(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                            setKeyword(newInputValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Return"
                                fullWidth
                                slotProps={{
                                    input: {
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {isFetching ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    },
                                }}
                            />
                        )}
                        renderOption={(props, option) => {
                            const { key, ...optionProps } = props;
                            return (
                                <li key={key} {...optionProps}>
                                    <Grid container sx={{ alignItems: 'center' }}>
                                        <Grid sx={{ display: 'flex', width: 44 }}>
                                            <FlightIcon sx={{ color: 'text.secondary' }} />
                                        </Grid>
                                        <Grid sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                                            <Box
                                                component="span"
                                                sx={{ fontWeight: 'bold' }}
                                            >
                                                {option.label}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </li>
                            );
                        }}
                    />
                </Grid>
            </Grid>
        </form>
    )
};
