import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';
import {Button, Paper, TextField} from "@mui/material";

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
            <Paper className="tw-mt-6 tw-w-full tw-overflow-hidden tw-px-8 tw-py-12 sm:tw-max-w-md sm:tw-rounded-lg">
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="email" value="Email" />

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
                            label="Password*"
                            className="tw-mt-1 tw-block"
                            value={data.password}
                            variant="outlined"
                            fullWidth={true}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                            helperText={errors.password_confirmation && errors.password_confirmation}
                        />
                    </div>

                    <div className="tw-mt-4">
                        <Button type={"submit"} disabled={processing} variant="contained" fullWidth>
                            Reset Password
                        </Button>
                    </div>
                </form>
            </Paper>
        </GuestLayout>
    );
}
