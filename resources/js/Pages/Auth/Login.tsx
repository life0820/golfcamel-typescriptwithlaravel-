import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {TextField, Checkbox, Button, Paper} from "@mui/material";
import GuestLayout from '@/Layouts/GuestLayout';

const Login = ({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>

            <Head title="Log in" />

            {status && (
                <div className="tw-mb-4 tw-text-sm tw-font-medium tw-text-green-600">
                    {status}
                </div>
            )}

            <Paper className="tw-mt-6 tw-w-full tw-overflow-hidden tw-px-8 tw-py-12 sm:tw-max-w-md sm:tw-rounded-lg">
                <div className="tw-text-center">
                    <img alt={"logo"} src={"/assets/image/logo/logo.png"} />
                </div>

                <form onSubmit={submit}>
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

                    <div className="tw-mt-2 tw-block">
                        <label className="tw-flex tw-items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <span className="tw-ms-1 tw-text-sm tw-text-gray-600">
                                Remember me
                            </span>
                        </label>
                    </div>

                    <div className="tw-mt-2 tw-flex tw-items-center tw-justify-between">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="tw-rounded-md tw-text-sm tw-text-gray-600 tw-underline hover:tw-text-gray-900 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2"
                            >
                                Forgot your password?
                            </Link>
                        )}
                        <Link
                            href={route('register')}
                            className="tw-rounded-md tw-text-sm tw-text-gray-600 tw-underline hover:tw-text-gray-900 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2"
                        >
                            Create One
                        </Link>
                    </div>
                    <div className="tw-mt-4">
                        <Button type={"submit"} disabled={processing} variant="contained" fullWidth>
                            Log in
                        </Button>
                    </div>
                </form>
            </Paper>
        </GuestLayout>
    );
}

export default Login;
