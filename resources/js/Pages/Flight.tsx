import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    FormControl,
    FormControlLabel,
    List,
    Radio,
    RadioGroup,
    Divider,
    Typography,
    Card,
    Button,
    Pagination, Drawer,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Accordion,
    AccordionActions,
    AccordionSummary,
    AccordionDetails,
    TextField,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {ReturnForm} from "@/Components/Flight/ReturnForm";
import {OnewayForm} from "@/Components/Flight/OnewayForm";
import {MulticityForm} from "@/Components/Flight/Multicity";
import { Skeleton } from "@/Components/Skeleton";
import {useGetFlightOffersMutation, useGetFlightOfferPriceMutation} from "@/toolkit/services/flight";
import Grid from "@mui/material/Grid2";
import LoadingButton from '@mui/lab/LoadingButton';
import {Segment} from "@/Components/Flight/Segment";
import moment from "moment";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import BackpackIcon from '@mui/icons-material/Backpack';
import LuggageIcon from '@mui/icons-material/Luggage';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IPassengerPrice {
    type: string;
    size: number;
    base: number;
    total: number;
}

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

interface ITravelerContact {
    emailAddress: string;
    phones: {
        deviceType: string;
        contryCallingCode?: string;
        number: string;
    }[];
}

interface ITravelerForm {
    id: string;
    dateOfBirth: string;
    name: {
        firstName: string;
        lastName: string;
    };
    gender: string;
    contact?: ITravelerContact;
}

export default function Flight(props: any) {
    const [type, setType] = useState(props.type);
    const [page, setPage] = React.useState(1);
    const [state, setState] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [passengerDetails, setPassengerDetails] = React.useState<IPassengerPrice[]>([]);
    const [flightOffer, setFlightOffer] = React.useState<any>();
    const [flightOffers, setFlightOffers] = React.useState<IPassenger[]>([]);
    const [travelers, setTravelers] = React.useState<ITravelerForm[]>([]);
    const [selected, setSelected] = React.useState<number>();
    const [filters, { data, isLoading }] = useGetFlightOffersMutation();
    const [getFlightOfferPrice, fetchedFlightOfferPrice] = useGetFlightOfferPriceMutation();

    useEffect(() => {
        if(props && Object.keys(props).length > 0 && !props.originDestinations) {
            filters({
                originLocationCode: props.originLocationCode,
                destinationLocationCode: props.destinationLocationCode,
                departureDate: props.departureDate,
                returnDate: props.returnDate,
                adults: props.adults * 1,
                children: props.children * 1,
                infants: props.infants * 1,
                travelClass: props.travelClass,
            });
        }
    }, []);

    useEffect(() => {
        if (data) {
            const slicedData = slice(data, page);
            setFlightOffers(slicedData);
        }
    }, [data, page]);

    useEffect(() => {
        const { data, isLoading } = fetchedFlightOfferPrice;
        if(data && !isLoading) {
            let passengers: IPassengerPrice[] = [];
            data.flightOfferPrice.data.flightOffers[0].travelerPricings.forEach((traveler: any) => {
                let passenger = passengers.filter((passenger: IPassengerPrice, index: number) => passenger.type === traveler.travelerType);
                if(!passenger.length) {
                    const newPassenger: IPassengerPrice = {
                        type: traveler.travelerType,
                        size: 1,
                        base: traveler.price.base,
                        total: traveler.price.total,
                    };
                    passengers.push(newPassenger);
                } else {
                    const newPassenger: IPassengerPrice = {...passenger[0], size: (passenger[0].size + 1)};
                    passengers = passengers.map((passenger: IPassengerPrice, index: number) => passenger.type === traveler.travelerType ? newPassenger : passenger);
                }
            })
            setPassengerDetails(passengers);
            setFlightOffer(data.flightOfferPrice.data.flightOffers[0]);
            setState(true);
        }
    }, [fetchedFlightOfferPrice]);

    const handleClickOpen = () => {

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const toggleDrawer =
        (open: boolean, item: any, index: number) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }
                if(item) {
                    let iataCodes: string[] = [];
                    item.itineraries.forEach((itinerary: any) => {
                        itinerary.segments.forEach((segment: any) => {
                            if(!iataCodes.includes(segment.departure.iataCode)) iataCodes.push(segment.departure.iataCode);
                            if(!iataCodes.includes(segment.arrival.iataCode)) iataCodes.push(segment.arrival.iataCode);
                        })
                    });
                    setSelected(index);
                    getFlightOfferPrice({ iataCodes, offer: item });
                } else {
                    setState(false);
                }
            };

    const slice = (items: any, currentPage: number) => {
        const startIndex: number = (currentPage - 1) * 20;
        const endIndex: number = startIndex + 20;
        return items.slice(startIndex, endIndex);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="tw-relative">
                    <div className="tw-mx-auto tw-max-w-7xl">
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="type"
                                value={type}
                                onChange={e => setType(e.target.value)}
                            >
                                <FormControlLabel value="0" control={<Radio/>} label="Return"/>
                                <FormControlLabel value="1" control={<Radio/>} label="One Way"/>
                                <FormControlLabel value="2" control={<Radio/>} label="Multi-City"/>
                            </RadioGroup>
                        </FormControl>
                        {
                            type === "0" ? (
                                <ReturnForm { ...props } />
                            ) : type === "1" ? <OnewayForm { ...props } /> : <MulticityForm  { ...props }/>
                        }
                    </div>
                </div>
            }
        >
            <div className="tw-mx-auto tw-max-w-7xl sm:tw-px-6 lg:tw-px-8">
                {
                    isLoading ? <Skeleton /> :
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {flightOffers && flightOffers.map((item: any, i: number) => (
                                <Card className="tw-mt-3 tw-py-3" key={i}>
                                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                                        <Grid size={8}>
                                            {
                                                item.itineraries.map((itinerary: any, index: number) => (
                                                    <Grid container spacing={2} justifyContent="center" alignItems="center" key={index} className="tw-mt-2">
                                                        <Grid size='auto'>
                                                            <Typography variant="body2" sx={{ fontSize: '1.5rem', fontWeight: 'bold!important'}}>
                                                                {moment(itinerary.segments[0].departure.at).format('hh:mm A')}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold!important'}}>
                                                                {moment(itinerary.segments[0].departure.at).format('dd D/M')}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem', fontWeight: 'bold!important'}}>
                                                                {itinerary.segments[0].departure.iataCode}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid size={8}>
                                                            <Typography variant="body2" sx={{ textAlign: 'center'}}>
                                                                {moment(moment(itinerary.segments[0].arrival.at).diff(itinerary.segments[0].departure.at)).format('hh[h] mm[m]')}
                                                            </Typography>
                                                             <Divider>{itinerary.segments.length > 1  && <FlightTakeoffIcon />}</Divider>
                                                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center'}}>
                                                                {itinerary.segments.length < 2 ? 'Direct' : `${itinerary.segments.length - 1} stop`}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid size='auto'>
                                                            <Typography variant="body2" sx={{ fontSize: '1.5rem', fontWeight: 'bold!important'}}>
                                                                {moment(itinerary.segments[itinerary.segments.length - 1].arrival.at).format('hh:mm A')}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'bold!important'}}>
                                                                {moment(itinerary.segments[itinerary.segments.length - 1].arrival.at).format('dd D/M')}
                                                            </Typography>
                                                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem', fontWeight: 'bold!important'}}>
                                                                {itinerary.segments[itinerary.segments.length - 1].arrival.iataCode}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                        <Divider orientation="vertical" variant="middle" flexItem />
                                        <Grid size={3}>
                                            <Typography variant="body2" sx={{ fontSize: '2rem', fontWeight: 'bold!important', textAlign: 'center', color: '#f2007d'}}>
                                                £{item.price.total}
                                            </Typography>
                                            <LoadingButton loading={i === selected ? fetchedFlightOfferPrice.isLoading : false} loadingPosition="start" variant="contained" onClick={toggleDrawer(true, item, i)} fullWidth sx={{ marginTop: '2rem' }}>View Detail</LoadingButton>
                                        </Grid>
                                    </Grid>
                                </Card>
                                ))
                            }
                            {
                                data && <Pagination count={Math.ceil(data.length / 20)} page={page} onChange={handleChange} sx={{ marginTop: '2rem' }}/>
                            }
                            <Drawer
                                anchor="right"
                                open={state}
                                onClose={toggleDrawer(false, null, -1)}
                                sx={{
                                    position: 'relative',
                                    backgroundColor: '#F7F7F8',
                                    '& .css-y7ab46-MuiPaper-root-MuiDrawer-paper': {
                                        width: '500px',
                                    }
                                }}
                            >
                                <div className="tw-flex tw-justify-between tw-items-center tw-p-2 tw-text-right tw-sticky tw-left-0 tw-top-0 tw-shadow tw-bg-white tw-z-50">
                                    {
                                        flightOffer && <Typography variant="body2" sx={{fontSize: 18, fontWeight: 'bold'}}>
                                            Total Price: £{ flightOffer.price.total }
                                        </Typography>
                                    }
                                    <Button variant="contained" onClick={handleClickOpen}>Select</Button>
                                </div>
                                <div className="tw-h-full tw-px-6 tw-py-4">
                                    {
                                        flightOffer && flightOffer.itineraries.map((itinerary: any, index: number) =>
                                            <div key={index}>
                                                {
                                                    itinerary.segments.map((segment: any, i: number) =>
                                                        <Segment
                                                            key={i}
                                                            departure={segment.departure}
                                                            arrival={segment.arrival}
                                                            departureAirport={fetchedFlightOfferPrice.data && fetchedFlightOfferPrice.data.details && (fetchedFlightOfferPrice.data.details.filter((detail: any) => detail.iata_code === segment.departure.iataCode).length ? fetchedFlightOfferPrice.data.details.filter((detail: any) => detail.iata_code === segment.departure.iataCode)[0].name : segment.departure.iataCode)}
                                                            arrivalAirport={fetchedFlightOfferPrice.data && fetchedFlightOfferPrice.data.details && (fetchedFlightOfferPrice.data.details.filter((detail: any) => detail.iata_code === segment.arrival.iataCode).length ? fetchedFlightOfferPrice.data.details.filter((detail: any) => detail.iata_code === segment.arrival.iataCode)[0].name : segment.arrival.iataCode)}
                                                            nextArrival={i !== (itinerary.segments.length - 1) ? itinerary.segments[i + 1].departure : null}
                                                        />
                                                    )
                                                }
                                                {index !== (flightOffer.itineraries.length - 1) &&
                                                    <Divider sx={{margin: '2rem 0'}}/>}
                                            </div>
                                        )
                                    }
                                    <div className="tw-p-4 tw-mt-8"
                                         style={{border: '1px solid #d9d9de', borderRadius: 8}}>
                                        <Typography variant="h6" className="tw-font-bold"
                                                    sx={{fontSize: 16, marginBottom: '16px'}}>
                                            Baggage Allowance
                                        </Typography>
                                        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                                            <Grid size="auto">
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid size="auto">
                                                        <BackpackIcon/>
                                                    </Grid>
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Small Bag
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary"
                                                                    sx={{fontSize: 14}}>
                                                            Must fit under the seat in front
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid size={"auto"}>
                                                <Typography variant="body2" className="tw-text-green-500">
                                                    Included
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container alignItems="center" justifyContent="space-between" spacing={2}
                                              className="tw-mt-2">
                                            <Grid size="auto">
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid size="auto">
                                                        <BackpackIcon/>
                                                    </Grid>
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Cabin Bag
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary"
                                                                    sx={{fontSize: 14}}>
                                                            Fits in overhead storage
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid size={"auto"}>
                                                <Typography variant="body2" className="tw-text-green-500">
                                                    Included
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container alignItems="center" justifyContent="space-between" spacing={2}
                                              className="tw-mt-2">
                                            <Grid size="auto">
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid size="auto">
                                                        <LuggageIcon/>
                                                    </Grid>
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Checked luggage
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary"
                                                                    sx={{fontSize: 14}}>
                                                            1 item per adult
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid size={"auto"}>
                                                <Typography variant="body2" className="tw-text-green-500">
                                                    Included
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                    <div className="tw-p-4 tw-mt-8"
                                         style={{border: '1px solid #d9d9de', borderRadius: 8}}>
                                        <Grid container spacing={2}>
                                            {
                                                passengerDetails.length && passengerDetails.map((passengerDetail: IPassengerPrice, index: number) =>
                                                    <Grid size={4} key={index}>
                                                        <Typography variant="h6" className="tw-font-bold"
                                                                    sx={{fontSize: 16, marginBottom: '16px'}}>
                                                            { `${passengerDetail.type} X ${passengerDetail.size}` }
                                                        </Typography>
                                                        <Typography variant="h6" className="tw-font-bold"
                                                                    sx={{fontSize: 14, marginBottom: '16px'}}>
                                                            { `Base Price: £${passengerDetail.base}` }
                                                        </Typography>
                                                        <Typography variant="h6" className="tw-font-bold"
                                                                    sx={{fontSize: 14}}>
                                                            { `Total Price: £${passengerDetail.total}` }
                                                        </Typography>
                                                    </Grid>
                                                )
                                            }
                                        </Grid>

                                    </div>
                                </div>
                            </Drawer>
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                                maxWidth="xl"
                                sx={{ '& .css-pdteti-MuiPaper-root-MuiDialog-paper': {backgroundColor: '#f3f3f3' } }}
                            >
                                <DialogTitle id="alert-dialog-title">
                                    Check Out
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        {
                                            passengerDetails.length > 0 && passengerDetails.map((passengerDetail: IPassengerPrice, index: number) =>
                                                <Accordion key={index} defaultExpanded={passengerDetail.type === 'ADULT'}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls="panel1-content"
                                                        id="panel1-header"
                                                    >
                                                        { passengerDetail.type }
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {
                                                            Array.from({ length: passengerDetail.size }, (_, index) => index).map((_, index: number) =>
                                                                <Grid container alignItems="center" key={index} spacing={2} className="tw-mt-1">
                                                                    <Grid size={3}>
                                                                        <FormControl fullWidth>
                                                                            <TextField id={`${passengerDetail.type}-${index}-firstname`} label="First Name*" variant="outlined" />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid size={3}>
                                                                        <FormControl fullWidth>
                                                                            <TextField id={`${passengerDetail.type}-${index}-lastname`} label="Last Name*" variant="outlined" />
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid size={3}>
                                                                        <FormControl fullWidth>
                                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                                <DemoContainer components={['DatePicker']} sx={{ pt: 0, overflow: 'unset', "& .css-1b1fjlj-MuiFormControl-root-MuiTextField-root": { minWidth: 'auto!important', width: "100%" } }}>
                                                                                    <DatePicker label="Birthday*" format="YYYY-MM-DD" />
                                                                                </DemoContainer>
                                                                            </LocalizationProvider>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid size={3}>
                                                                        <FormControl fullWidth>
                                                                            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                                                                            <Select
                                                                                labelId="demo-simple-select-label"
                                                                                id={`${passengerDetail.type}-${index}-gender`}
                                                                                label="Gender*"
                                                                                // onChange={handleChange}
                                                                            >
                                                                                <MenuItem value="MALE">MALE</MenuItem>
                                                                                <MenuItem value="FEMALE">FEMALE</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                </Grid>
                                                            )
                                                        }
                                                        {
                                                            passengerDetail.type === 'ADULT' &&
                                                                <React.Fragment>
                                                                    <Divider variant="inset" component="div" sx={{ margin: '0.75rem 0px' }}>Contact</Divider>
                                                                    <Grid container rowGap={1} spacing={2}>
                                                                        <Grid size={12}>
                                                                            <FormControl fullWidth>
                                                                                <TextField id={`${passengerDetail.type}-${index}-email`} label="Email*" variant="outlined" />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid size={4}>
                                                                            <FormControl fullWidth>
                                                                                <TextField id={`${passengerDetail.type}-${index}-devicetype`} label="DeviceType*" variant="outlined" />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid size={4}>
                                                                            <FormControl fullWidth>
                                                                                <TextField id={`${passengerDetail.type}-${index}-countryCallingCode`} label="CountryCallingCode*" variant="outlined" />
                                                                            </FormControl>
                                                                        </Grid>
                                                                        <Grid size={4}>
                                                                            <FormControl fullWidth>
                                                                                <TextField id={`${passengerDetail.type}-${index}-number`} label="Number*" variant="outlined" />
                                                                            </FormControl>
                                                                        </Grid>
                                                                    </Grid>
                                                                </React.Fragment>
                                                        }
                                                    </AccordionDetails>
                                                </Accordion>
                                            )
                                        }
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained" onClick={handleClose} autoFocus>
                                        Check Out
                                    </Button>
                                    <Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
                                </DialogActions>
                            </Dialog>
                        </List>
                }
            </div>
        </AuthenticatedLayout>
    )
}
