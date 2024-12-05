import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

import Main from './index';

const appName:any = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title:string):string => `${title} - ${appName}`,
    resolve: (name:string):Promise<unknown> =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }):void {
        const root = createRoot(el);

        root.render(
            <Main>
                <App {...props} />
            </Main>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
