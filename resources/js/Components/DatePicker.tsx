import * as React from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker as MDesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from "dayjs";

export const DatePicker = (props: { changeDate: any, value: string }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
                components={[
                    'DesktopDatePicker',
                ]}
                sx={{ pt: 0, overflow: 'unset', "& .css-5rcoci-MuiStack-root": { minWidth: 'auto!important', width: "100%" } }}
            >
                <DemoItem>
                    <MDesktopDatePicker
                        label="Departure"
                        format="YYYY-MM-DD"
                        value={props.value ? dayjs(props.value) : null}
                        onChange={(value, context) => props.changeDate(value)}
                    />
                </DemoItem>
            </DemoContainer>
        </LocalizationProvider>
    );
}
