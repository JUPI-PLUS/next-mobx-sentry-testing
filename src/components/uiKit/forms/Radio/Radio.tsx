// libs
import React, { forwardRef, useId } from "react";

// models
import { RadioProps } from "./models";

const Radio = forwardRef<HTMLDivElement, RadioProps>(
    ({ label = "", name, value, checked, disabled = false, className = "", iconClassName = "", ...rest }, ref) => {
        const customId = useId();

        return (
            <div className={`flex items-center ${className}`} ref={ref}>
                <label
                    htmlFor={`${value ?? ""}${customId}`}
                    className="cursor-pointer relative flex items-center justify-center"
                >
                    <input
                        type="radio"
                        name={name}
                        value={value}
                        {...rest}
                        disabled={disabled}
                        checked={checked}
                        id={`${value ?? ""}${customId}`}
                        className={`peer appearance-none w-5 h-5 ${iconClassName}`}
                    />
                    <span
                        className={`absolute top-1/2 left-0 -translate-y-1/2 flex justify-center items-center w-5 h-5 rounded-full border transition-all
                       ${
                           disabled
                               ? "border-dark-400 peer-checked:bg-dark-300"
                               : `border-dark-700 peer-checked:border-brand-100 ${
                                     !checked && "peer-hover:border-dark-800"
                                 }`
                       }
                    `}
                    ></span>
                    <span
                        className={`opacity-0 peer-checked:opacity-100 absolute top-1/2 left-0 -translate-y-1/2 translate-x-1/2 flex justify-center items-center w-2.5 h-2.5 rounded-full transition-all",
                        ${disabled ? "bg-dark-500" : "bg-brand-100"}
                    `}
                    ></span>
                    {label && <span className="pl-2">{label}</span>}
                </label>
            </div>
        );
    }
);

export default Radio;
