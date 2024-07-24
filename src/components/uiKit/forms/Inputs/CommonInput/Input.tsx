import React, { forwardRef, useId, useMemo } from "react";
import { InputProps } from "./models";
import FieldError from "../../FieldError/FieldError";

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            startIcon,
            endIcon,
            label,
            name,
            errorMessage,
            inputClassName = "",
            containerClassName = "",
            value,
            isFilter = false,
            onChange = () => {},
            formRef,
            ...rest
        },
        ref
    ) => {
        const customId = useId();
        const inputIconPadding = `${startIcon ? "pl-10" : ""} ${endIcon ? "pr-10" : ""}`;
        const inputIconPosition = `${label ? "pt-3 top-1/2 -translate-y-1/2" : "top-1/2 -translate-y-1/2"}`;

        const ringClassName = useMemo(() => {
            const classNames = [];

            if (errorMessage) {
                return "outline-red-100 outline outline-2 outline-offset-0 border-transparent focus:border-transparent";
            }

            if (value && isFilter) {
                classNames.push(
                    "outline",
                    "outline-offset-0",
                    "outline-brand-200",
                    "border-transparent",
                    "focus:border-transparent"
                );
            }

            return classNames.join(" ");
        }, [isFilter, errorMessage, value]);

        return (
            <div className={`flex flex-col ${containerClassName}`}>
                <div className="w-full flex flex-col relative">
                    <input
                        aria-errormessage={errorMessage}
                        aria-label={label?.toString() || rest.placeholder}
                        aria-disabled={rest.disabled}
                        {...rest}
                        onChange={onChange}
                        value={value}
                        name={name}
                        ref={ref}
                        id={`${name ?? ""}${customId}`}
                        className={`peer w-full order-2 border-inset border border-dark-600 rounded-lg outline-none ${inputIconPadding} text-md px-4 py-3 max-h-10 disabled:text-dark-700 disabled:bg-dark-100 placeholder:text-dark-800 focus:border-dark-900 ${ringClassName} ${inputClassName}`}
                    />
                    {startIcon && (
                        <div
                            className={`absolute left-3 w-5 h-5 text-dark-700 peer-focus:text-dark-900 ${inputIconPosition}`}
                        >
                            {startIcon}
                        </div>
                    )}
                    {endIcon && (
                        <div
                            className={`absolute right-3 w-5 h-5 text-dark-700 peer-focus:text-dark-900 ${inputIconPosition}`}
                        >
                            {endIcon}
                        </div>
                    )}
                    {label && (
                        <label
                            ref={formRef}
                            htmlFor={`${name ?? ""}${customId}`}
                            className="text-xs font-medium text-dark-800 peer-focus:text-dark-900 order-1 mb-1.5"
                        >
                            {label}
                        </label>
                    )}
                </div>
                {errorMessage && <FieldError name={name} message={errorMessage} className="text-xs order-3 mt-1.5" />}
            </div>
        );
    }
);

export default Input;
