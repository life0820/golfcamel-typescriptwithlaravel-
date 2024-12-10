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
    Pagination, Drawer
} from "@mui/material";
import {ReturnForm} from "@/Components/Flight/ReturnForm";
import {OnewayForm} from "@/Components/Flight/OnewayForm";
import {MulticityForm} from "@/Components/Flight/Multicity";
import { Skeleton } from "@/Components/Skeleton";
import {useGetFlightOffersMutation, useGetAirportDetailsMutation} from "@/toolkit/services/flight";
import Grid from "@mui/material/Grid2";
import {Segment} from "@/Components/Flight/Segment";
import moment from "moment";

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BackpackIcon from '@mui/icons-material/Backpack';
import LuggageIcon from '@mui/icons-material/Luggage';

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

export default function Flight(props: any) {
    const [type, setType] = useState(props.type);
    const [page, setPage] = React.useState(1);
    const [state, setState] = React.useState(false);
    const [flightOffer, setFlightOffer] = React.useState<any>();
    const [flightOffers, setFlightOffers] = React.useState<IPassenger[]>([]);
    const [filters, { data, isLoading, isSuccess, isError, error }] = useGetFlightOffersMutation();
    const [getAirportDetails, fetchedAirportDetails] = useGetAirportDetailsMutation();

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
        } else {
            const originDestinations = JSON.parse(props.originDestinations);
        }
    }, []);

    useEffect(() => {
        if (data) {
            const slicedData = slice(data, page);
            setFlightOffers(slicedData);
        }
    }, [data, page]);

    useEffect(() => {
        const { data, isLoading } = fetchedAirportDetails;
        if(data && !isLoading) {
            setState(true);
        }
    }, [fetchedAirportDetails]);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const toggleDrawer =
        (open: boolean, item: any) =>
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

                    getAirportDetails({ iataCodes });
                } else {
                    setState(false);
                }
                setFlightOffer(item);
            };

    const slice = (items: any, currentPage: number) => {
        const startIndex = (currentPage - 1) * 20;
        const endIndex = startIndex + 20;
        return items.slice(startIndex, endIndex);
    };

    const baggageAllowance = () => {

    }


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
                                            <Button variant="contained" onClick={toggleDrawer(true, item)} fullWidth sx={{ marginTop: '2rem' }}>View Detail</Button>
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
                                onClose={toggleDrawer(false, null)}
                                sx={{
                                    position: 'relative',
                                    backgroundColor: '#F7F7F8',
                                    '& .css-y7ab46-MuiPaper-root-MuiDrawer-paper': {
                                        width: '500px',
                                    }
                                }}
                            >
                                <div className="tw-p-2 tw-text-right tw-sticky tw-left-0 tw-top-0 tw-shadow tw-bg-white tw-z-50">
                                    <Button variant="contained">Select</Button>
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
                                                            departureAirport={fetchedAirportDetails.data && (fetchedAirportDetails.data.filter((detail: any) => detail.iata_code === segment.departure.iataCode).length ? fetchedAirportDetails.data.filter((detail: any) => detail.iata_code === segment.departure.iataCode)[0].name : segment.departure.iataCode)}
                                                            arrivalAirport={fetchedAirportDetails.data && (fetchedAirportDetails.data.filter((detail: any) => detail.iata_code === segment.arrival.iataCode).length ? fetchedAirportDetails.data.filter((detail: any) => detail.iata_code === segment.arrival.iataCode)[0].name : segment.arrival.iataCode)}
                                                            nextArrival={i !== (itinerary.segments.length - 1) ? itinerary.segments[i + 1].departure : null}
                                                        />
                                                    )
                                                }
                                                {index !== (flightOffer.itineraries.length - 1) &&
                                                    <Divider sx={{margin: '2rem 0'}}/>}
                                            </div>
                                        )
                                    }
                                    <div className="tw-p-4 tw-mt-8" style={{border: '1px solid #d9d9de', borderRadius: 8}}>
                                        <Typography variant="h6" className="tw-font-bold" sx={{ fontSize: 16, marginBottom: '16px' }}>
                                            Baggage Allowance
                                        </Typography>
                                        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                                            <Grid size="auto">
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid size="auto">
                                                        <BackpackIcon />
                                                    </Grid>
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Small Bag
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: 14 }}>
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
                                        <Grid container alignItems="center" justifyContent="space-between" spacing={2} className="tw-mt-2">
                                            <Grid size="auto">
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid size="auto">
                                                        <BackpackIcon />
                                                    </Grid>
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Cabin Bag
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: 14 }}>
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
                                        <Grid container alignItems="center" justifyContent="space-between" spacing={2} className="tw-mt-2">
                                            <Grid size="auto">
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid size="auto">
                                                        <LuggageIcon />
                                                    </Grid>
                                                    <Grid size="auto">
                                                        <Typography variant="body2" color="textSecondary">
                                                            Checked luggage
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: 14 }}>
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
                                </div>
                            </Drawer>
                        </List>
                }
            </div>
        </AuthenticatedLayout>
    )
}
