import React, {useEffect, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import {Segment} from "@/Components/Flight/Segment";
import {Divider} from "@mui/material";
import {useDeleteCartMutation} from "@/toolkit/services/flight";

interface Props {
    id: number;
    type: string;
    data: any
}

function Row(props: { row: Props, removeCart: any }) {
    const { row, removeCart } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.type}
                </TableCell>
                <TableCell align="right">
                    {
                        row.data.itineraries[0].segments.length > 1 ?
                            `${row.data.itineraries[0].segments[0].departure.iataCode} - ${row.data.itineraries[0].segments[row.data.itineraries[0].segments.length - 1].arrival.iataCode}` :
                            `${row.data.itineraries[0].segments[0].departure.iataCode} - ${row.data.itineraries[0].segments[0].arrival.iataCode}`
                    }
                </TableCell>
                <TableCell align="right">
                    { row.data.price.total }
                </TableCell>
                <TableCell align="right">
                    <IconButton aria-label="delete" onClick={removeCart(row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            {
                                row.data && row.data.itineraries.map((itinerary: any, index: number) =>
                                    <div key={index}>
                                        {
                                            itinerary.segments.map((segment: any, i: number) =>
                                                <Segment
                                                    key={i}
                                                    departure={segment.departure}
                                                    arrival={segment.arrival}
                                                    departureAirport={segment.departure.iataCode}
                                                    arrivalAirport={segment.arrival.iataCode}
                                                    nextArrival={i !== (itinerary.segments.length - 1) ? itinerary.segments[i + 1].departure : null}
                                                />
                                            )
                                        }
                                        {index !== (row.data.itineraries.length - 1) &&
                                            <Divider sx={{margin: '2rem 0'}}/>}
                                    </div>
                                )
                            }
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function Cart({ carts }: { carts: Props[] }) {
    const [data, setData] = useState<Props[]>([]);
    const [deleteCart, deletedCart] = useDeleteCartMutation();

    useEffect(() => {
        setData(carts);
    }, []);

    useEffect(() => {
        if(deletedCart.data && deletedCart.data.success) {
            setData(data.filter((cart: Props, index: number) => cart.id !== deletedCart.data.id));
        }
    }, [deletedCart]);

    const removeCart = (id: number) => (e: any) => {
        deleteCart({ id });
    }
    return (
        <AuthenticatedLayout
            header={
                <h2 className="tw-text-xl tw-font-semibold tw-leading-tight tw-text-gray-800">
                    Cart Page
                </h2>
            }
        >
            <Head title="Cart" />
            <div className="tw-py-12 tw-relative">
                <div className="tw-mx-auto tw-max-w-7xl sm:tw-px-6 lg:tw-px-8">
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">Description</TableCell>
                                    <TableCell align="right">Total Price(£)</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data && data.length ? data.map((cart: Props, index: number) => (
                                    <Row key={index} row={cart} removeCart={removeCart} />
                                )) : <TableRow>
                                        <TableCell colSpan={5} align="center">No data</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
