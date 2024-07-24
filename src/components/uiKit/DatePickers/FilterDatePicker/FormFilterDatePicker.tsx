// libs
import React, { useCallback } from "react";
import { DateRange } from "react-day-picker";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { format } from "date-fns";

// models
import { FormDateRangePickerProps } from "../models";

// components
import FilterDatePicker from "./FilterDatePicker";

// constants
import { DATE_FORMATS } from "../../../../shared/constants/formates";

const getInputDateValue = (date?: DateRange): string => {
    const start = date?.from ? format(date.from, DATE_FORMATS.DATE_ONLY) : "";
    const end = date?.to ? format(date.to, DATE_FORMATS.DATE_ONLY) : "";
    return end ? `${start} - ${end}` : start;
};

const FormFilterDatePicker = <T extends FieldValues>({
    name,
    onChange,
    placeholder,
    label,
    disabledDate,
    disabled,
    popperPlacement,
    ...rest
}: FormDateRangePickerProps<T>) => {
    const { control } = useFormContext();
    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (value?: DateRange) => {
                onChange?.(value);
                controllerCallback(value);
            };
        },
        [onChange]
    );

    return (
        <Controller
            render={({ field: { ref, onChange: onFormFieldChange, onBlur, value } }) => {
                const inputValue = getInputDateValue(value);
                return (
                    <FilterDatePicker
                        name={name}
                        date={value}
                        label={label}
                        onChange={onFieldChange(onFormFieldChange)}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        disabledDate={disabledDate}
                        value={inputValue}
                        popperPlacement={popperPlacement}
                        formRef={ref}
                        {...rest}
                    />
                );
            }}
            name={name}
            control={control}
        />
    );
};

export default FormFilterDatePicker;
