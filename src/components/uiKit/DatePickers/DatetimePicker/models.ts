import { DatePickerProps } from "../models";
import { DateRange } from "react-day-picker";
import { FieldErrors, FieldValues, UseControllerProps } from "react-hook-form";

export interface TimeSelectValue {
    value: string;
    label: string;
}

export interface DatetimePickerProps extends Omit<DatePickerProps, "onChange"> {
    onChange?: (date?: DateRange, time?: string, timestamp?: number) => void;
}

export type FormDatetimeRangePickerProps<T extends FieldValues> = {
    value?: DateRange;
    onChange?: (value: DateRange) => void;
    errors?: FieldErrors;
} & UseControllerProps<T> &
    DatetimePickerProps;
