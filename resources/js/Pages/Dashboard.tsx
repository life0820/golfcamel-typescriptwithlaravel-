import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {Box, FormControl, Tab, Tabs, RadioGroup, FormControlLabel, Radio} from '@mui/material';
import { FlightTakeoff, Bed, CarRental, SportsGolf } from '@mui/icons-material';
import { ReturnForm } from "@/Components/Flight/ReturnForm";
import { OnewayForm } from "@/Components/Flight/OnewayForm";
import { MulticityForm } from "@/Components/Flight/Multicity";

export default function Dashboard() {
    const [value, setValue] = useState(0);
    const [type, setType] = useState("0");

    const handleChange = (event:any, newValue:any) => {
        setValue(newValue);
    };

    // @ts-ignore
    return (
        <AuthenticatedLayout
            header={
                <h2 className="tw-text-xl tw-font-semibold tw-leading-tight tw-text-gray-800">
                    The Whole in One
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div
                className="tw-absolute tw-left-0 tw-top-20 tw-w-full"
                style={{
                    backgroundImage: 'url(/assets/image/home/background.jpg)',
                    height: 'calc(100vh - 80px)',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    filter: 'blur(6px)',
                }}
            />
            <div className="tw-py-12 tw-relative">
                <div className="tw-mx-auto tw-max-w-7xl sm:tw-px-6 lg:tw-px-8">
                    <div className="tw-overflow-hidden tw-bg-white tw-shadow-sm sm:tw-rounded-lg">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="fullWidth"
                            sx={{ boxShadow: '0px 0px 4px rgba(0,0,0,0.3)' }}
                        >
                            <Tab icon={<FlightTakeoff />} iconPosition="start" label={<h1 className={"tw-text-lg tw-font-bold "}>Flight</h1>} />
                            <Tab icon={<Bed />} iconPosition="start" label={<h1 className={"tw-text-lg tw-font-bold"}>Hotel</h1>} />
                            <Tab icon={<CarRental />} iconPosition="start" label={<h1 className={"tw-text-lg tw-font-bold"}>Car</h1>} />
                            <Tab icon={<SportsGolf />} iconPosition="start" label={<h1 className={"tw-text-lg tw-font-bold"}>Golf</h1>} />
                        </Tabs>
                        <Box component="section" sx={{ p: 4 }}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="type"
                                    value={type}
                                    onChange={e => setType(e.target.value)}
                                >
                                    <FormControlLabel value="0" control={<Radio />} label="Return" />
                                    <FormControlLabel value="1" control={<Radio />} label="One Way" />
                                    <FormControlLabel value="2" control={<Radio />} label="Multi-City" />
                                </RadioGroup>
                            </FormControl>
                            {
                                type === "0" ? (
                                    <ReturnForm />
                                ) : type === "1" ? <OnewayForm /> : <MulticityForm />
                            }
                        </Box>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
