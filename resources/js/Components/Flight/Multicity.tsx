import React, {useEffect} from 'react';
import {Button, Card, Popover, TextField, Typography, CardContent, CardActions, CardHeader, FormControlLabel, RadioGroup, Radio} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {useForm} from "@inertiajs/react";
import { AutoComplete } from '@/Components/AutoComplete';

import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import moment from "moment";
import {DatePicker} from "@/Components/DatePicker";

import ClearIcon from '@mui/icons-material/Clear';

interface IPassenger {
    adults: number;
    children: number;
    infants: number;
    travelClass: string;
}

interface IOriginDestination {
    id: string;
    originLocationCode: string;
    destinationLocationCode: string;
    departureDateTimeRange: {
        date: string;
    }
}

interface IForm extends IPassenger {
    originDestinations: IOriginDestination[];
}

const initialOriginDestination: IOriginDestination = {
    id: "",
    originLocationCode: "",
    destinationLocationCode: "",
    departureDateTimeRange: {
        date: ""
    }
}

export const MulticityForm = (props:any) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { setData, post, processing, errors, reset, ...form } = useForm<IForm>({
        originDestinations: [
            {
                id: "1",
                originLocationCode: "",
                destinationLocationCode: "",
                departureDateTimeRange: {
                    date: ""
                }
            }
        ],
        adults: 1,
        children: 0,
        infants: 0,
        travelClass: 'ECONOMY'
    });
    const [passenger, setPassenger] = React.useState<IPassenger>({
        adults: 1,
        children: 0,
        infants: 0,
        travelClass: "ECONOMY"
    });

    useEffect(() => {
        if(passenger.infants > (passenger.adults - 1)) setPassenger({ ...passenger, infants: passenger.adults});
    }, [passenger.adults]);

    const swapOriginAndDestination = (index: number) => {
        const originLocationCode: string = form.data.originDestinations[index].originLocationCode;
        const destinationLocationCode: string = form.data.originDestinations[index].destinationLocationCode;
        setData('originDestinations', form.data.originDestinations.filter((originDestination: IOriginDestination, i: number) =>
            i === index ? { ...originDestination, originLocationCode: destinationLocationCode, destinationLocationCode: originDestination } : originDestination
        ));
    }

    const checkValidPassenger = (key: 'adults' | 'children' | 'infants', plus: boolean) => {
        if(plus) {
            return (passenger.adults + passenger.children) > 8
        } else {
            let compare = (key === 'adults') ? 2 : 1;
            return passenger[key] < compare;
        }
    }

    const handleClickPassenger = (event: React.MouseEvent<HTMLInputElement>) => {
        // @ts-ignore
        setAnchorEl(event.currentTarget);
        setPassenger({
            ...passenger,
            ...form.data
        });
    };

    const changeDate = (index:number, date: any) => {
        setData('originDestinations', form.data.originDestinations.map((originDestination: IOriginDestination, i:number) =>
            i === index ? { ...originDestination, departureDateTimeRange: { date: moment(date['$d']).format('YYYY-MM-DD') } } : originDestination
        ));
    }

    const onChangeOriginDestinationItem= (index: number, field: string, value: string) => {
        setData('originDestinations', form.data.originDestinations.map((originDestination: IOriginDestination, i:number) =>
            i === index ? { ...originDestination, [field]: value } : originDestination
        ));
    }

    const addCity = () => {
        let originDestinations = form.data.originDestinations
        if(originDestinations.length < 6) {
            originDestinations.push({ ...initialOriginDestination, id: String(form.data.originDestinations.length + 1) });
            setData('originDestinations', originDestinations);
        }
    }

    const removeCity = (index: number) => {
        setData('originDestinations', form.data.originDestinations.filter((originDestination: IOriginDestination, i: number) => i !== index && originDestination));
    }

    const submit = async (event: any) => {
        console.log(form.data);
        event.preventDefault();
    }

    return (
        <form onSubmit={submit}>
            {
                form.data.originDestinations.map((origonDestination: IOriginDestination, index: number) =>
                    <Grid container spacing={2} key={index} className="tw-mt-3" alignItems="center">
                        <Grid size={2.5}>
                            <AutoComplete value={origonDestination.originLocationCode}
                                          onChange={(newValue: any) => onChangeOriginDestinationItem(index, 'originLocationCode', newValue.value)}/>
                        </Grid>
                        <Grid size={"auto"}>
                            <Button
                                size="large"
                                variant="outlined"
                                disabled={(!(origonDestination.originLocationCode && origonDestination.destinationLocationCode))}
                                color="primary"
                                sx={{
                                    minWidth: 'auto',
                                    width: '40px',
                                    height: '40px',
                                    p: 0,
                                    borderRadius: '50%',
                                }}
                                onClick={() => swapOriginAndDestination(index)}
                            >
                                <SyncAltIcon/>
                            </Button>
                        </Grid>
                        <Grid size={2.5}>
                            <AutoComplete value={origonDestination.destinationLocationCode}
                                          onChange={(newValue: any) => onChangeOriginDestinationItem(index, 'destinationLocationCode', newValue.value)}/>
                        </Grid>
                        <Grid size={3}>
                            <DatePicker changeDate={(newValue: any) => changeDate(index, newValue)}/>
                        </Grid>
                        {
                            index !== 0 &&
                                <Grid size="auto">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            minWidth: 'auto',
                                            width: '32px',
                                            height: '32px',
                                            p: 0,
                                            mr: 1,
                                            borderRadius: '50%',
                                            border: 'none'
                                        }}
                                        onClick={() => removeCity(index)}
                                    >
                                        <ClearIcon />
                                    </Button>
                                </Grid>
                        }
                        <Grid size={2}>
                            {
                                !index && <div>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="Passenger/Class"
                                        value={`${(form.data.adults + form.data.children + form.data.infants)} Travellers / ${form.data.travelClass}`}
                                        variant="filled"
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                                onClick: handleClickPassenger
                                            },
                                        }}
                                        sx={{
                                            '& .css-h3fyr2-MuiInputBase-root-MuiFilledInput-root': {
                                                backgroundColor: 'white!important',
                                            },
                                            '& .css-h3fyr2-MuiInputBase-root-MuiFilledInput-root::before': {
                                                borderBottom: 'none!important',
                                            },
                                            '& .css-h3fyr2-MuiInputBase-root-MuiFilledInput-root::after': {
                                                borderBottom: 'none!important',
                                            },
                                            '& input': {
                                                background: 'white',
                                                border: '1px solid #c4c4c4',
                                                borderRadius: '4px'
                                            }
                                        }}
                                    />
                                    <Popover
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        id="passengers"
                                        open={Boolean(anchorEl)}
                                        anchorEl={anchorEl}
                                        onClose={() => setAnchorEl(null)}
                                    >
                                        <Card sx={{minWidth: 300}}>
                                            <CardHeader
                                                title="Passenger"
                                                sx={{
                                                    borderBottom: '1px solid #c4c4c4',
                                                    '& span': {fontSize: '18px!important'}
                                                }}
                                            />
                                            <CardContent>
                                                <Grid container justifyContent="space-between" alignItems="center">
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary"
                                                                    component="p">Adults</Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p"
                                                                    sx={{fontSize: '10px'}}>12+ years</Typography>
                                                    </Grid>
                                                    <Grid size={5} className="tw-flex tw-justify-around tw-items-center">
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                if (!checkValidPassenger('adults', false)) setPassenger({
                                                                    ...passenger,
                                                                    adults: passenger.adults - 1
                                                                });
                                                            }}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                width: '32px',
                                                                height: '32px',
                                                                p: 0,
                                                                mr: 1
                                                            }}
                                                        >
                                                            <RemoveIcon/>
                                                        </Button>
                                                        <span>{passenger.adults}</span>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                if (!checkValidPassenger('adults', true)) setPassenger({
                                                                    ...passenger,
                                                                    adults: passenger.adults + 1
                                                                });
                                                            }}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                width: '32px',
                                                                height: '32px',
                                                                p: 0,
                                                                ml: 1
                                                            }}
                                                        >
                                                            <AddIcon/>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justifyContent="space-between" alignItems="center"
                                                      className="tw-mt-2">
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary"
                                                                    component="p">Children</Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p"
                                                                    sx={{fontSize: '10px'}}>2-11+ years</Typography>
                                                    </Grid>
                                                    <Grid size={5} className="tw-flex tw-justify-around tw-items-center">
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                if (!checkValidPassenger('children', false)) setPassenger({
                                                                    ...passenger,
                                                                    children: passenger.children - 1
                                                                });
                                                            }}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                width: '32px',
                                                                height: '32px',
                                                                p: 0,
                                                                mr: 1
                                                            }}
                                                        >
                                                            <RemoveIcon/>
                                                        </Button>
                                                        <span>{passenger.children}</span>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                if (!checkValidPassenger('children', true)) setPassenger({
                                                                    ...passenger,
                                                                    children: passenger.children + 1
                                                                });
                                                            }}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                width: '32px',
                                                                height: '32px',
                                                                p: 0,
                                                                ml: 1
                                                            }}
                                                        >
                                                            <AddIcon/>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justifyContent="space-between" alignItems="center"
                                                      className="tw-mt-2">
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary"
                                                                    component="p">Infants</Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p"
                                                                    sx={{fontSize: '10px'}}>Under 2 years</Typography>
                                                    </Grid>
                                                    <Grid size={5} className="tw-flex tw-justify-around tw-items-center">
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                if (passenger.infants > 0) setPassenger({
                                                                    ...passenger,
                                                                    infants: passenger.infants - 1
                                                                });
                                                            }}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                width: '32px',
                                                                height: '32px',
                                                                p: 0,
                                                                mr: 1
                                                            }}
                                                        >
                                                            <RemoveIcon/>
                                                        </Button>
                                                        <span>{passenger.infants}</span>
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => {
                                                                if (passenger.adults !== passenger.infants && passenger.infants < passenger.adults) setPassenger({
                                                                    ...passenger,
                                                                    infants: passenger.infants + 1
                                                                });
                                                            }}
                                                            sx={{
                                                                minWidth: 'auto',
                                                                width: '32px',
                                                                height: '32px',
                                                                p: 0,
                                                                ml: 1
                                                            }}
                                                        >
                                                            <AddIcon/>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                            <CardHeader
                                                title="Class"
                                                sx={{
                                                    paddingTop: '0px',
                                                    borderBottom: '1px solid #c4c4c4',
                                                    '& span': {fontSize: '18px!important'}
                                                }}
                                            />
                                            <CardContent>
                                                <RadioGroup
                                                    value={passenger.travelClass}
                                                    name="travelClass"
                                                    onChange={(event: React.ChangeEvent, value: string) => setPassenger({
                                                        ...passenger,
                                                        travelClass: value
                                                    })}
                                                    sx={{fontSize: '18px'}}
                                                >
                                                    <FormControlLabel value="ECONOMY" control={<Radio/>} label="ECONOMY"/>
                                                    <FormControlLabel value="PREMIUN_ECONOMY" control={<Radio/>}
                                                                      label="PREMIUM ECONOMY"/>
                                                    <FormControlLabel value="BUSINESS" control={<Radio/>} label="BUSINESS"/>
                                                    <FormControlLabel value="FIRST" control={<Radio/>} label="FIRST"/>
                                                </RadioGroup>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => {
                                                        setData({
                                                            ...form.data,
                                                            ...passenger
                                                        });
                                                        setAnchorEl(null);
                                                    }}
                                                >
                                                    Done
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Popover>
                                </div>
                            }
                        </Grid>
                        <Grid size={"auto"}>
                            {
                                !index && <Button
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    sx={{height: "100%"}}
                                    type="submit"
                                    // onClick={swapOriginAndDestination}
                                >
                                    <SearchIcon/>
                                </Button>
                            }
                        </Grid>
                    </Grid>
                )
            }
            <div className="tw-mt-2">
                <Button variant="outlined" color="primary" onClick={addCity} sx={{ border: 'none' }}>Add City</Button>
            </div>
        </form>
    )
};
