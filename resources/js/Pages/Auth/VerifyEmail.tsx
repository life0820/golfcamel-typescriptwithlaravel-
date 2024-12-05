import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import {Button, Paper} from "@mui/material";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />
            <Paper className="tw-mt-6 tw-w-full tw-overflow-hidden tw-px-8 tw-py-12 sm:tw-max-w-md sm:tw-rounded-lg">
                <div className="tw-mb-4 tw-text-sm tw-text-gray-600">
                    Thanks for signing up! Before getting started, could you verify
                    your email address by clicking on the link we just emailed to
                    you? If you didn't receive the email, we will gladly send you
                    another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="tw-mb-4 tw-text-sm tw-font-medium tw-text-green-600">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="tw-mt-4 tw-flex tw-items-center tw-justify-between">
                        <Button type={"submit"} variant={"contained"} fullWidth disabled={processing}>
                            Resend Verification Email
                        </Button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="tw-rounded-md tw-text-sm tw-text-gray-600 tw-underline hover:tw-text-gray-900 tw-focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-yellow-500 focus:tw-ring-offset-2"
                        >
                            Log Out
                        </Link>
                    </div>
                </form>
            </Paper>
        </GuestLayout>
    );
}
