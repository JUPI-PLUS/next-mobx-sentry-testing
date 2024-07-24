import React, { FC, useId } from "react";
import { ToggleProps } from "./models";
import FieldError from "../FieldError/FieldError";
import { cn } from "../../../../shared/utils";

const Toggle: FC<ToggleProps> = ({
    label,
    name,
    checked,
    errorMessage,
    labelPosition = "start",
    containerClass = "",
    ...rest
}) => {
    const customId = useId();

    return (
        <div className={containerClass}>
            <div className={cn("flex items-center", rest.disabled ? "opacity-50" : "cursor-pointer")}>
                <div
                    className={cn(
                        "flex h-7 rounded-full w-11 relative transition-all shadow-inner cursor-pointer ring-inset focus-within:ring-1 ",
                        checked ? "bg-purple-100 focus-within:ring-dark-900" : "bg-dark-400 focus-within:ring-dark-600",
                        labelPosition === "start" ? "mr-2" : "ml-2 order-2"
                    )}
                >
                    <span
                        className={cn(
                            "rounded-full w-5 h-5 bg-white absolute pointer-events-none transition-transform cursor-pointer top-1",
                            checked ? "translate-x-full" : "translate-x-1"
                        )}
                    />
                    <input
                        aria-label={label?.toString()}
                        aria-disabled={rest.disabled}
                        type="checkbox"
                        name={name}
                        id={`${name ?? ""}${customId}`}
                        {...rest}
                        checked={checked}
                        className={`w-full h-full opacity-0 cursor-pointer ${
                            labelPosition === "start" ? "" : "order-1"
                        }`}
                    />
                </div>
                {label && <label htmlFor={`${name ?? ""}${customId}`}>{label}</label>}
            </div>
            {errorMessage && <FieldError name={name} message={errorMessage} />}
        </div>
    );
};

export default Toggle;
