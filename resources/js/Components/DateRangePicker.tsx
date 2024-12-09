import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker as MDateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {DateRange, DateRangeValidationError, PickerChangeHandlerContext} from "@mui/x-date-pickers-pro";
import {Dayjs} from "dayjs";

export const DateRangePicker = (props: { changeDateRange: any }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['SingleInputDateRangeField']} sx={{ pt: 0, overflow: 'unset', "& .MuiTextField-root": { minWidth: 'auto!important' } }}>
        <MDateRangePicker
          slots={{ field: SingleInputDateRangeField }}
          name="allowedRange"
          label="Departure - Return"
          format="YYYY-MM-DD"
          onChange={(value:DateRange<Dayjs>, context:PickerChangeHandlerContext<DateRangeValidationError>) => props.changeDateRange(value)}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
