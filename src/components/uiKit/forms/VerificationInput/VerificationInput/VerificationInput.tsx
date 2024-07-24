// libs
import React, { forwardRef } from "react";

// models
import { VerificationInputProps } from "./models";

// components
import BaseVerificationInput from "../BaseVerificationInput/BaseVerificationInput";
import FieldError from "../../FieldError/FieldError";

const VerificationInput = forwardRef<HTMLInputElement, VerificationInputProps>(
    (
        {
            name,
            value,
            length,
            onChange,
            onCompleted,
            errorMessage,
            containerClassName = "",
            inputClassName = "",
            ...rest
        },
        ref
    ) => {
        return (
            <div className={`flex flex-col max-w-min ${containerClassName}`}>
                <div className={`flex w-full gap-2 ${inputClassName}`}>
                    <BaseVerificationInput
                        value={value}
                        onChange={onChange}
                        onCompleted={onCompleted}
                        length={length}
                        isError={Boolean(errorMessage)}
                        data-testid="verification-single-input"
                        {...rest}
                    />
                </div>
                {errorMessage && (
                    <div>
                        <FieldError name={name} message={errorMessage} className="mt-2 justify-center" />
                    </div>
                )}
            </div>
        );
    }
);

export default VerificationInput;
