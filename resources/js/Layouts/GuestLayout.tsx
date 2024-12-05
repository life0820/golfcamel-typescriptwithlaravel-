import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="tw-flex tw-min-h-screen tw-flex-col tw-items-center tw-bg-gray-100 tw-pt-6 sm:tw-justify-center sm:tw-pt-0">
            {children}
        </div>
    );
}
