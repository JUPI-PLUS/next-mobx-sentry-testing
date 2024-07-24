import React, { forwardRef } from "react";
import { DatePickerInputProps } from "../../models";
import { CalendarIcon } from "@heroicons/react/20/solid";
import Input from "../../../forms/Inputs/CommonInput/Input";
import { XMarkIcon } from "@heroicons/react/20/solid";

const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
    ({ name, value, placeholder, toggleCalendarVisibility, onReset, label, disabled, ...rest }, ref) => {
        return (
            <div>
                <Input
                    ref={ref}
                    readOnly
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    onClick={toggleCalendarVisibility}
                    data-testid="datepicker-input"
                    label={label}
                    disabled={disabled}
                    endIcon={
                        value ? (
                            <XMarkIcon
                                data-testid={`${name}-reset-calendar-value-icon`}
                                className="hover:bg-gray-30 hover:rounded-full cursor-pointer"
                                onClick={() => onReset()}
                            />
                        ) : (
                            <CalendarIcon
                                data-testid={`${name}-calendar-icon`}
                                className="cursor-pointer"
                                onClick={toggleCalendarVisibility}
                            />
                        )
                    }
                    {...rest}
                />
            </div>
        );
    }
);

export default DatePickerInput;
