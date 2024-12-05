import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';
import {Button, Paper, TextField} from "@mui/material";
import GuestLayout from '@/Layouts/GuestLayout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>

            <Head title="Forgot Password"/>

            <Paper className="tw-mt-6 tw-w-full tw-overflow-hidden tw-px-8 tw-py-12 sm:tw-max-w-md sm:tw-rounded-lg">

                <div className="tw-mb-4 tw-text-sm tw-text-gray-600">
                    Forgot your password? No problem. Just let us know your email
                    address and we will email you a password reset link that will
                    allow you to choose a new one.
                </div>

                {status && (
                    <div className="tw-mb-4 tw-text-sm tw-font-medium tw-text-green-600">
                        {status}
                    </div>
                )}

                <form onSubmit={submit}>
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

                    <div className="tw-mt-4 tw-flex tw-items-center tw-justify-end">
                        <Button type={'submit'} className="tw-ms-4" disabled={processing} variant={"contained"} fullWidth>
                            Email Password Reset Link
                        </Button>
                    </div>
                </form>
            </Paper>
        </GuestLayout>
    );
}
