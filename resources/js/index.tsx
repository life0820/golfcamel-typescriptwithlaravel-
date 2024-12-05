import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { theme as customTheme } from './Config/theme.config';
import {Theme} from "@emotion/react";

const theme:Theme = createTheme(customTheme);

const Main = (props:any) => {
    return (
        <ThemeProvider theme={theme}>
            {props.children}
        </ThemeProvider>
    )
}

export default Main;
