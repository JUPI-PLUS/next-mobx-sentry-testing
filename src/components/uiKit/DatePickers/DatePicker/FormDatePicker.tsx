import React, { useCallback } from "react";
import { DateRange } from "react-day-picker";
import { Controller, FieldValues, useFormContext } from "react-hook-form";
import { FormDateRangePickerProps } from "../models";
import DatePicker from "./DatePicker";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../../../shared/constants/formates";

const FormDatePicker = <T extends FieldValues>({
    name,
    onChange,
    placeholder,
    label,
    disabledDate,
    disabled,
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
            render={({ fieldState: { error }, field: { ref, onChange: onFormFieldChange, onBlur, value } }) => {
                const dateRangeValue = value as DateRange;
                const inputValue = dateRangeValue?.from ? format(dateRangeValue.from, DATE_FORMATS.DATE_ONLY) : "";
                return (
                    <DatePicker
                        name={name}
                        date={value}
                        label={label}
                        onChange={onFieldChange(onFormFieldChange)}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        disabled={disabled}
                        disabledDate={disabledDate}
                        value={inputValue}
                        errorMessage={error?.message}
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

export default FormDatePicker;
