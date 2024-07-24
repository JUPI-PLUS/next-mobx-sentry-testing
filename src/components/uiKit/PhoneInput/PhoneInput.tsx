// libs
import React, { forwardRef, useId, useMemo } from "react";
import { PhoneInput as InternationalPhoneInput } from "react-international-phone";

// styles
import classes from "./PhoneInput.module.css";

// models
import { PhoneInputProps } from "./models";

// components
import FieldError from "../forms/FieldError/FieldError";

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        {
            label,
            name,
            errorMessage,
            inputClassName = "",
            containerClassName = "",
            initialCountry = "de",
            value,
            isFilter = false,
            onChange = () => {},
            formRef,
            disabled = false,
            ...rest
        },
        ref
    ) => {
        const customId = useId();

        const ringClassName = useMemo(() => {
            if (errorMessage)
                return "rounded-lg outline-red-100 outline outline-2 outline-offset-0 border-transparent focus:border-transparent";

            if (value && isFilter)
                return "rounded-lg outline outline-offset-0 outline-brand-200 border-transparent focus:border-transparent";

            return "";
        }, [isFilter, errorMessage, value]);

        return (
            <div className={`flex flex-col ${containerClassName}`}>
                <div className="w-full flex flex-col relative">
                    {label && (
                        <label
                            ref={formRef}
                            htmlFor={`${name ?? ""}${customId}`}
                            className="text-xs font-medium text-dark-800 peer-focus:text-dark-900 mb-1.5"
                        >
                            {label}
                        </label>
                    )}
                    {/* TODO: find out why "ref" is missing in InputHTMLAttributes<HTMLInputElement> type */}
                    <InternationalPhoneInput
                        inputProps={{
                            name,
                            id: `${name ?? ""}${customId}`,
                            // ref,
                            ...rest,
                        }}
                        disabled={disabled}
                        onChange={onChange}
                        value={value}
                        className={ringClassName}
                        inputClassName={`peer w-full outline-none px-4 py-3 placeholder:text-dark-800 focus:border-dark-900 ${inputClassName}`}
                        initialCountry={initialCountry}
                        countrySelectorStyleProps={{
                            buttonClassName: `!pl-4 !pr-2 ${ringClassName}`,
                            dropdownArrowClassName: `!border-none h-6 w-6 !m-0 ${classes.chevron_down}`,
                            dropdownStyleProps: {
                                className: "rounded-lg outline-none",
                                listItemClassName: "!px-4 !py-3",
                            },
                        }}
                    />
                </div>
                {errorMessage && <FieldError name={name} message={errorMessage} className="text-xs mt-1.5" />}
            </div>
        );
    }
);
export default PhoneInput;
