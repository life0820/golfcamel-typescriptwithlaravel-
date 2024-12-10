import React, {useEffect} from 'react';
import {Button, Card, Popover, TextField, Typography, CardContent, CardActions, CardHeader, FormControlLabel, RadioGroup, Radio} from "@mui/material";
import Grid from '@mui/material/Grid2';
import {useForm} from "@inertiajs/react";
import { AutoComplete } from '@/Components/AutoComplete';
import { DateRangePicker } from '@/Components/DateRangePicker';

import SyncAltIcon from '@mui/icons-material/SyncAlt';
import SearchIcon from '@mui/icons-material/Search';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import moment from "moment";
import {DatePicker} from "@/Components/DatePicker";
import {Inertia} from "@inertiajs/inertia";

interface IPassenger {
    adults: number;
    children: number;
    infants: number;
    travelClass: string;
}

interface IForm extends  IPassenger{
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate: string;
}


export const OnewayForm = (props:any) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { setData, post, processing, errors, reset, ...form } = useForm<IForm>({
        originLocationCode: '',
        destinationLocationCode: '',
        departureDate: '',
        returnDate: '',
        adults: 1,
        children: 0,
        infants: 0,
        travelClass: "ECONOMY"    // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    });
    const [passenger, setPassenger] = React.useState<IPassenger>({
        adults: 1,
        children: 0,
        infants: 0,
        travelClass: "ECONOMY"
    });

    useEffect(() => {
        if(props && Object.keys(props).length > 0) {
            setData({
                ...form.data,
                ...props
            });
        }
    }, [props]);

    useEffect(() => {
        if(passenger.infants > (passenger.adults - 1)) setPassenger({ ...passenger, infants: passenger.adults});
    }, [passenger.adults]);

    const swapOriginAndDestination = () => {
        const originLocationCode: string = form.data.originLocationCode;
        setData({
            ...form.data,
            'originLocationCode': form.data.destinationLocationCode,
            'destinationLocationCode': originLocationCode
        })
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

    const changeDate = (date: any) => {
        setData({
            ...form.data,
            departureDate: moment(date['$d']).format('YYYY-MM-DD')
        })
    }

    const submit = async (event: any) => {
        event.preventDefault();
        // Use Inertia to navigate with query parameters
        Inertia.get('/flight/result', { ...form.data, type: "1" });
    }

    return (
        <form onSubmit={submit}>
            <Grid container spacing={2} className="tw-mt-3">
                <Grid size={2.5}>
                    <AutoComplete value={form.data.originLocationCode} onChange={(newValue: any) => setData("originLocationCode", newValue.value)} />
                </Grid>
                <Grid size={"auto"}>
                    <Button
                        size="large"
                        variant="contained"
                        disabled={(!(form.data.originLocationCode && form.data.destinationLocationCode))}
                        color="primary"
                        sx={{ height: "100%" }}
                        onClick={swapOriginAndDestination}
                    >
                        <SyncAltIcon />
                    </Button>
                </Grid>
                <Grid size={2.5}>
                    <AutoComplete value={form.data.destinationLocationCode} onChange={(newValue: any) => setData("destinationLocationCode", newValue.value)} />
                </Grid>
                <Grid size={3}>
                    <DatePicker value={form.data.departureDate} changeDate={changeDate} />
                </Grid>
                <Grid size={2}>
                    <div>
                        <TextField
                            id="filled-read-only-input"
                            label="Passenger/Class"
                            value={`${(form.data.adults * 1 + form.data.children * 1 + form.data.infants * 1)} Travellers / ${form.data.travelClass}`}
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
                            <Card sx={{ minWidth: 300 }}>
                                <CardHeader
                                    title="Passenger"
                                    sx={{ borderBottom: '1px solid #c4c4c4', '& span': { fontSize: '18px!important' } }}
                                />
                                <CardContent>
                                    <Grid container justifyContent="space-between" alignItems="center">
                                        <Grid size="auto">
                                            <Typography variant="body2" color="textSecondary" component="p">Adults</Typography>
                                            <Typography variant="body2" color="textSecondary" component="p" sx={{ fontSize: '10px' }}>12+ years</Typography>
                                        </Grid>
                                        <Grid size={5} className="tw-flex tw-justify-around tw-items-center">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    if(!checkValidPassenger('adults', false)) setPassenger({...passenger, adults: passenger.adults - 1});
                                                }}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '32px',
                                                    height: '32px',
                                                    p: 0,
                                                    mr: 1
                                                }}
                                            >
                                                <RemoveIcon />
                                            </Button>
                                            <span>{passenger.adults}</span>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    if(!checkValidPassenger('adults', true)) setPassenger({ ...passenger, adults: passenger.adults + 1});
                                                }}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '32px',
                                                    height: '32px',
                                                    p: 0,
                                                    ml: 1
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="space-between" alignItems="center" className="tw-mt-2">
                                        <Grid size="auto">
                                            <Typography variant="body2" color="textSecondary" component="p">Children</Typography>
                                            <Typography variant="body2" color="textSecondary" component="p" sx={{ fontSize: '10px' }}>2-11+ years</Typography>
                                        </Grid>
                                        <Grid size={5} className="tw-flex tw-justify-around tw-items-center">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    if(!checkValidPassenger('children', false)) setPassenger({...passenger, children: passenger.children - 1});
                                                }}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '32px',
                                                    height: '32px',
                                                    p: 0,
                                                    mr: 1
                                                }}
                                            >
                                                <RemoveIcon />
                                            </Button>
                                            <span>{passenger.children}</span>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    if(!checkValidPassenger('children', true)) setPassenger({...passenger, children: passenger.children + 1});
                                                }}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '32px',
                                                    height: '32px',
                                                    p: 0,
                                                    ml: 1
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container justifyContent="space-between" alignItems="center" className="tw-mt-2">
                                        <Grid size="auto">
                                            <Typography variant="body2" color="textSecondary" component="p">Infants</Typography>
                                            <Typography variant="body2" color="textSecondary" component="p" sx={{ fontSize: '10px' }}>Under 2 years</Typography>
                                        </Grid>
                                        <Grid size={5} className="tw-flex tw-justify-around tw-items-center">
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    if(passenger.infants > 0) setPassenger({ ...passenger, infants: passenger.infants - 1});
                                                }}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '32px',
                                                    height: '32px',
                                                    p: 0,
                                                    mr: 1
                                                }}
                                            >
                                                <RemoveIcon />
                                            </Button>
                                            <span>{passenger.infants}</span>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    if(passenger.adults !== passenger.infants && passenger.infants < passenger.adults) setPassenger({ ...passenger, infants: passenger.infants + 1});
                                                }}
                                                sx={{
                                                    minWidth: 'auto',
                                                    width: '32px',
                                                    height: '32px',
                                                    p: 0,
                                                    ml: 1
                                                }}
                                            >
                                                <AddIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardHeader
                                    title="Class"
                                    sx={{ paddingTop: '0px', borderBottom: '1px solid #c4c4c4', '& span': { fontSize: '18px!important' } }}
                                />
                                <CardContent>
                                    <RadioGroup
                                        value={passenger.travelClass}
                                        name="travelClass"
                                        onChange={(event: React.ChangeEvent, value: string) => setPassenger({ ...passenger, travelClass: value})}
                                        sx={{ fontSize: '18px' }}
                                    >
                                        <FormControlLabel value="ECONOMY" control={<Radio />} label="ECONOMY" />
                                        <FormControlLabel value="PREMIUN_ECONOMY" control={<Radio />} label="PREMIUM ECONOMY" />
                                        <FormControlLabel value="BUSINESS" control={<Radio />} label="BUSINESS" />
                                        <FormControlLabel value="FIRST" control={<Radio />} label="FIRST" />
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
                </Grid>
                <Grid size={"auto"}>
                    <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        sx={{ height: "100%" }}
                        type="submit"
                        // onClick={swapOriginAndDestination}
                    >
                        <SearchIcon />
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
};
