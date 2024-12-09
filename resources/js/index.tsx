import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { theme as customTheme } from './Config/theme.config';
import {Theme} from "@emotion/react";
import { Provider } from 'react-redux';

import {store} from "@/toolkit/store";

const theme:Theme = createTheme(customTheme);

const Main = (props:any) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </Provider>
    )
}

export default Main;
