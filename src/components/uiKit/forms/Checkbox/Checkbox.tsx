import React, { forwardRef, useId } from "react";
import { CheckboxProps } from "./models";
import FieldError from "../FieldError/FieldError";
import CheckboxIcon from "./CheckboxIcons";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label = "", name, value, checked, errorMessage, className = "", ...rest }, ref) => {
        const customId = useId();

        return (
            <div>
                <div className="flex items-center">
                    <label
                        htmlFor={`${name ?? ""}${customId}`}
                        className="cursor-pointer relative flex items-center justify-center leading-none"
                    >
                        <input
                            type="checkbox"
                            name={name}
                            id={`${name ?? ""}${customId}`}
                            value={value}
                            aria-errormessage={errorMessage}
                            aria-label={label?.toString()}
                            aria-disabled={rest.disabled}
                            {...rest}
                            checked={checked}
                            className={`peer appearance-none accent-brand-100 w-5 h-5 rounded cursor-pointer indeterminate:bg-brand-100 checked:bg-brand-100 [&:not(:checked)]:border-2 [&:not(:checked)]:border-gray-100 ${className}`}
                            ref={ref}
                        />
                        <span className="peer-disabled:bg-gray-300 peer-disabled:border-dark-400 peer-disabled:cursor-not-allowed border absolute top-0 left-0 flex justify-center items-center w-5 h-5 rounded cursor-pointer">
                            <CheckboxIcon checked={checked} checkboxValue={value} />
                        </span>
                        {label && <span className="pl-2">{label}</span>}
                    </label>
                </div>
                {errorMessage && <FieldError name={name} message={errorMessage} />}
            </div>
        );
    }
);

export default Checkbox;
