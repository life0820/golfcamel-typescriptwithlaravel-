import { Head, Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';
import {Button, Paper, TextField} from "@mui/material";
import GuestLayout from '@/Layouts/GuestLayout';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register"/>

            <Paper className="tw-mt-6 tw-w-full tw-overflow-hidden tw-px-8 tw-py-12 sm:tw-max-w-md sm:tw-rounded-lg">
                <div className="tw-text-center">
                    <img alt={"logo"} src={"/assets/image/logo/logo.png"}/>
                </div>

                <form onSubmit={submit}>
                    <div className="tw-mt-4">
                        <TextField
                            error={!!errors.name}
                            id="name"
                            type="name"
                            name="name"
                            label="User Name*"
                            className="tw-mt-1 tw-block"
                            value={data.name}
                            variant="outlined"
                            fullWidth={true}
                            onChange={(e) => setData("name", e.target.value)}
                            helperText={errors.name && errors.name}
                        />
                    </div>
                    <div className="tw-mt-4">
                        <TextField
                            error={!!errors.email}
                            id="email"
                            type="email"
                            name="email"
                            label="Email*"
                            className="tw-mt-1 tw-block"
                            value={data.email}
                            variant="outlined"
                            fullWidth={true}
                            onChange={(e) => setData("email", e.target.value)}
                            helperText={errors.email && errors.email}
                        />
                    </div>

                    <div className="tw-mt-4">
                        <TextField
                            error={!!errors.password}
                            id="password"
                            type="password"
                            name="password"
                            label="Password*"
                            className="tw-mt-1 tw-block"
                            value={data.password}
                            variant="outlined"
                            fullWidth={true}
                            onChange={(e) => setData("password", e.target.value)}
                            helperText={errors.password && errors.password}
                        />
                    </div>

                    <div className="tw-mt-4">
                        <TextField
                            error={!!errors.password_confirmation}
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            label="Confirm Password*"
                            className="tw-mt-1 tw-block"
                            value={data.password_confirmation}
                            variant="outlined"
                            fullWidth={true}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            helperText={errors.password_confirmation && errors.password_confirmation}
                        />
                    </div>

                    <div className="tw-mt-2 tw-flex tw-items-center tw-justify-end">
                        <Link
                            href={route('login')}
                            className="tw-rounded-md tw-text-sm tw-text-gray-600 tw-underline hover:tw-text-gray-900 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2"
                        >
                            Already registered?
                        </Link>
                    </div>
                    <div className="tw-mt-4">
                        <Button type={"submit"} disabled={processing} variant="contained" fullWidth>
                            Register
                        </Button>
                    </div>
                </form>
            </Paper>
        </GuestLayout>
    );
}
