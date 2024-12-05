import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';
import {Button, Paper, TextField} from "@mui/material";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />
            <Paper className="tw-mt-6 tw-w-full tw-overflow-hidden tw-px-8 tw-py-12 sm:tw-max-w-md sm:tw-rounded-lg">
                <div className="tw-mb-4 tw-text-sm tw-text-gray-600">
                    This is a secure area of the application. Please confirm your
                    password before continuing.
                </div>

                <form onSubmit={submit}>
                    <div className="mt-4">
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

                    <div className="mt-4 flex items-center justify-end">
                        <Button type={'submit'} className="tw-ms-4" disabled={processing} variant={"contained"} fullWidth>
                            Confirm
                        </Button>
                    </div>
                </form>

            </Paper>
        </GuestLayout>
    );
}
