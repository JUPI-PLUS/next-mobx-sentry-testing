import React, { Dispatch, ReactNode, RefObject, SetStateAction } from "react";
import { DateRange, Matcher } from "react-day-picker";
import { FieldErrors, FieldValues, RefCallBack, UseControllerProps } from "react-hook-form";
import { Placement } from "@popperjs/core/lib/enums";

export interface DatePickerProps {
    value?: string;
    date?: DateRange;
    onChange?: (value?: DateRange) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    name?: string;
    placeholder?: string;
    label?: string | ReactNode;
    disabled?: boolean;
    disabledDate?: Matcher | Matcher[];
    showOutsideDays?: boolean;
    popperPlacement?: Placement;
    shouldReset?: boolean;
    offsetSkidding?: number;
    offsetDistance?: number;
    errorMessage?: string;
    popperClassName?: string;
    isFilter?: boolean;
    formRef?: RefCallBack;
    maxYear?: number;
}

export interface DatePickerInputProps {
    value: string;
    name?: string;
    placeholder?: string;
    onReset: (range?: DateRange) => void;
    onBlur: () => void;
    toggleCalendarVisibility: () => void;
    label?: string | ReactNode;
    disabled?: boolean;
    selectedDate?: DateRange;
    isFilter?: boolean;
}

export interface DatePickerCalendarProps {
    inputRef?: RefObject<HTMLDivElement>;
    dateRange?: DateRange;
    setDate: Dispatch<SetStateAction<DateRange | undefined>>;
    onClickAway: () => void;
    disabled?: Matcher | Matcher[];
    showOutsideDays?: boolean;
    maxYear?: number;
}

export interface DatePickerFooterProps {
    range?: DateRange;
    onSubmit: (range: DateRange) => void;
    onCancel: () => void;
}

export type FormDateRangePickerProps<T extends FieldValues> = {
    value?: DateRange;
    onChange?: (value: DateRange) => void;
    errors?: FieldErrors;
} & UseControllerProps<T> &
    DatePickerProps;
