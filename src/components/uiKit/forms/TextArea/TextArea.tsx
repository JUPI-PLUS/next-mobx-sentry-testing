import React, { forwardRef, useId } from "react";
import { TextAreaProps } from "./models";
import FieldError from "../FieldError/FieldError";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, name, errorMessage, containerClassName = "", formRef, ...rest }, ref) => {
        const customId = useId();

        return (
            <div className={`flex flex-col ${containerClassName}`}>
                <textarea
                    {...rest}
                    id={`${name ?? ""}${customId}`}
                    ref={ref}
                    className={`peer w-full order-2 border border-inset border-dark-600 rounded-lg max-h-48 text-md px-4 py-2 font-medium outline-0 disabled:text-dark-700 disabled:bg-dark-100 placeholder:text-dark-800 focus:border-dark-900 ${
                        errorMessage
                            ? "outline outline-2 outline-red-100 border-transparent focus:border-transparent"
                            : ""
                    }`}
                />
                {label && (
                    <label
                        ref={formRef}
                        className="text-xs font-medium text-dark-800 peer-focus:text-dark-900 order-1 mb-1.5"
                        htmlFor={`${name ?? ""}${customId}`}
                    >
                        {label}
                    </label>
                )}
                {errorMessage && (
                    <div className="order-3">
                        <FieldError name={name} message={errorMessage} />
                    </div>
                )}
            </div>
        );
    }
);

export default TextArea;
