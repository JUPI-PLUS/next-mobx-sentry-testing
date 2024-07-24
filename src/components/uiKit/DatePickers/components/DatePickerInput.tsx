import React, { forwardRef, KeyboardEvent, useEffect, useState } from "react";
import { DatePickerInputProps } from "../models";
import { CalendarIcon } from "@heroicons/react/20/solid";
import Input from "../../forms/Inputs/CommonInput/Input";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { IMaskMixin } from "react-imask";
import { DEFAULT_MASK_OPTIONS } from "../constants";
import IMask from "imask";
import { ReactElementProps } from "react-imask/dist/mixin";
import { InputProps } from "../../forms/Inputs/CommonInput/models";
import { RefCallBack } from "react-hook-form";

interface CommonDatePickerInputProps extends DatePickerInputProps {
    options?: IMask.MaskedPatternOptions;
    onAccept: (inputValue: string) => void;
    onComplete: (inputValue: string) => void;
    errorMessage?: string;
    formRef?: RefCallBack;
}

const MaskedStyledInput = IMaskMixin<
    IMask.MaskedPatternOptions,
    false,
    string,
    HTMLInputElement,
    ReactElementProps<HTMLInputElement> & InputProps & { inputValue?: string }
>(({ inputRef, inputValue, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Input ref={inputRef as React.MutableRefObject<HTMLInputElement>} {...props} value={inputValue} />
));

const DatePickerInput = forwardRef<HTMLDivElement, CommonDatePickerInputProps>(
    (
        {
            options = DEFAULT_MASK_OPTIONS,
            name,
            value: _value,
            placeholder,
            toggleCalendarVisibility,
            onReset,
            onBlur,
            label,
            disabled,
            onComplete,
            onAccept,
            errorMessage,
            isFilter,
            formRef,
        },
        _ref
    ) => {
        const [inputValue, setInputValue] = useState(_value || "");
        const [lastPressedKey, setLastPressedKey] = useState("");

        const onResetIconClick = () => {
            setInputValue("");
            onReset();
        };

        const onAcceptCallback = (maskedValue: string) => {
            setInputValue(maskedValue);
            onAccept(maskedValue);
        };

        const handleOnBlur = () => {
            if (lastPressedKey === "Tab") {
                onBlur();
                setLastPressedKey("");
            }
        };

        const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
            setLastPressedKey(event.code);
        };

        useEffect(() => {
            setInputValue(_value);
        }, [_value]);

        const hasValue = Boolean(inputValue.length);
        const iconClassName = hasValue && isFilter ? "fill-dark-900" : "";

        return (
            <div ref={_ref}>
                <MaskedStyledInput
                    mask={options!.mask}
                    blocks={options!.blocks}
                    placeholder={placeholder}
                    name={name}
                    onClick={toggleCalendarVisibility}
                    onBlur={handleOnBlur}
                    onKeyDown={onKeyDown}
                    data-testid="datepicker-input"
                    label={label as string}
                    disabled={disabled}
                    errorMessage={errorMessage}
                    onAccept={onAcceptCallback}
                    onComplete={onComplete}
                    lazy
                    value={inputValue}
                    inputValue={inputValue}
                    isFilter={isFilter}
                    overwrite={true}
                    formRef={formRef}
                    endIcon={
                        hasValue ? (
                            <XMarkIcon
                                data-testid={`${name}-reset-calendar-value-icon`}
                                className={`hover:bg-gray-30 hover:rounded-full cursor-pointer ${iconClassName}`}
                                onClick={!disabled ? onResetIconClick : () => {}}
                            />
                        ) : (
                            <CalendarIcon
                                data-testid={`${name}-calendar-icon`}
                                className={`${disabled ? "fill-dark-600" : ""} cursor-pointer ${iconClassName}`}
                                onClick={!disabled ? toggleCalendarVisibility : () => {}}
                            />
                        )
                    }
                />
            </div>
        );
    }
);

export default DatePickerInput;
