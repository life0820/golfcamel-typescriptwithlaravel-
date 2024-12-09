import React, { useState, useEffect } from 'react';
import {
    TextField,
    CircularProgress,
    Autocomplete as MAutocomplete, Box,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useGetAirportsQuery } from "@/toolkit/services/flight";
import FlightIcon from '@mui/icons-material/Flight';
import { debounce } from '@mui/material/utils';

export const AutoComplete = (props:any) => {
    const [keyword, setKeyword] = useState<string>('');
    const [options, setOptions] = React.useState<readonly any[]>([]);   // airport or city option lists

    const onInputChange = debounce((v) => {
        setKeyword(v)
    }, 500)

    const {data, error, isLoading, isFetching} = useGetAirportsQuery(keyword, { skip: !keyword, refetchOnMountOrArgChange: true });
    useEffect(() => {
        if(data) {
            const formattedOptions = data.map((location: any) => ({
                label: `${location.name} (${location.iataCode}) - ${location.subType}`,
                value: location.iataCode,
            }));
            setOptions(formattedOptions);
        }
    }, [data]);

    return (
        <MAutocomplete
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
            value={props.value}
            noOptionsText="No locations"
            onChange={(event: any, newValue: any | null, reason) => {
                if(reason === 'selectOption') {
                    props.onChange(newValue);
                }
            }}
            onInputChange={(event, newInputValue, reason) => {
                if(reason === 'input') {
                    onInputChange(newInputValue);
                }
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

    )
};
