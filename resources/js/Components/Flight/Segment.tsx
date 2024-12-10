import React from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid2';
import moment from "moment/moment";
import {Typography} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RoomIcon from '@mui/icons-material/Room';

interface IAirportSegment {
    at: string;
    iataCode: string;
    terminal: string;
}

interface IProps {
    departure: IAirportSegment;
    arrival: IAirportSegment;
    departureAirport: string;
    arrivalAirport: string;
    nextArrival: IAirportSegment;
}

const useStyles = makeStyles({
    departureTime: {
        display: 'flex',
        flexDirection: 'column',
        columnGap: '2px',
        alignItems: 'center',
        '&:first-child': {
            fontSize: 14,
            color: '#747583'
        }
    },
    airport: {
        fontSize: 18,
        fontWeight: 600,
        paddingLeft: '1.5rem'
    },
    line: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '1px',
        border: '1px dashed #d9d9de',
        height: '100%',
    },
    duration: {
        backgroundColor: '#FAEDCC',
        borderRadius: 4,
        padding: '10px 16px',
        fontSize: 14,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 8,
        marginLeft: 24
    },
    mylocation: {
        position: 'absolute',
        left: 0,
        top: 0,
        transform: 'translateX(-50%)',
        color: '#46835D'
    },
    arrivallocation: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        transform: 'translate(-50%, 50%)',
        color: '#7c3aed',
    }
});

export const Segment = (props: IProps) => {
    const classes = useStyles();

    return (
        <div>
            <Grid container>
                <Grid size={3}>
                    <span className={classes.departureTime}>
                        {moment(props.departure.at).format('hh:mm A')}
                        <span>
                            {moment(props.departure.at).format('D MMM')}
                        </span>
                    </span>
                </Grid>
                <Grid size={9} className="tw-relative">
                    <MyLocationIcon className={classes.mylocation} />
                    <div className={classes.line} />
                    <Typography variant="h6" className={classes.airport}>
                        {`${props.departureAirport}(${props.departure.iataCode})`}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={3} className="tw-py-4">
                    <span className={classes.departureTime}>
                        <AccessTimeIcon />
                        <span>
                            {moment(moment(props.arrival.at).diff(props.departure.at)).format('h[h] mm[m]')}
                        </span>
                    </span>
                </Grid>
                <Grid size={9} className="tw-relative">
                    <div className={classes.line} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={3}>
                     <span className={classes.departureTime}>
                        {moment(props.arrival.at).format('hh:mm A')}
                        <span>
                            {moment(props.arrival.at).format('D MMM')}
                        </span>
                    </span>
                </Grid>
                <Grid size={9} className="tw-relative">
                    <div className={classes.line} />
                    <RoomIcon className={classes.arrivallocation} />
                    <Typography variant="h6" className={classes.airport}>
                        {`${props.arrivalAirport}(${props.arrival.iataCode})`}
                    </Typography>
                </Grid>
            </Grid>
            {
                props.nextArrival &&
                    <Grid container alignItems="center" className="tw-my-3">
                        <Grid size={3}>
                            <span className={classes.departureTime}>
                                <AccessTimeIcon sx={{ color: 'yellow' }} />
                                <span>
                                    {moment(moment(props.nextArrival.at).diff(props.arrival.at)).format('h[h] mm[m]')}
                                </span>
                            </span>
                        </Grid>
                        <Grid size={9} className="tw-relative">
                            <div className={classes.line} />
                            <div className={classes.duration}>
                                <strong className="tw-font-medium"> Stop over, Waiting inairport </strong>
                                <span>{`Duration : ${moment(moment(props.nextArrival.at).diff(props.arrival.at)).format('h[h] mm[m]')}`}</span>
                                <span>Travel documents/visas may be required </span>
                            </div>
                        </Grid>
                    </Grid>
            }
        </div>
    )
}
