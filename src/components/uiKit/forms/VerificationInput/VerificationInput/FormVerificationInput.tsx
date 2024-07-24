// libs
import React, { FC, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

// models
import { FormVerificationInputProps } from "./models";

// components
import VerificationInput from "./VerificationInput";

const FormVerificationInput: FC<FormVerificationInputProps> = ({
    name,
    onChange,
    defaultValue,
    onCompleted,
    ...rest
}) => {
    const { control } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (value: string) => {
                if (onChange) {
                    onChange(value);
                }
                controllerCallback(value);
            };
        },
        [onChange]
    );

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={defaultValue}
            render={({
                field: { ref, onChange: onFormFieldChange, name: controllerName, value },
                fieldState: { error },
            }) => (
                <VerificationInput
                    {...rest}
                    value={value}
                    name={controllerName}
                    onChange={onFieldChange(onFormFieldChange)}
                    onCompleted={onCompleted}
                    errorMessage={error?.message}
                    ref={ref}
                />
            )}
        />
    );
};

export default FormVerificationInput;
