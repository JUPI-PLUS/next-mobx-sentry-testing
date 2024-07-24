import React, { FC } from "react";
import { FormInputProps } from "../CommonInput/models";
import { Controller, useFormContext } from "react-hook-form";
import PasswordInput from "./PasswordInput";

const FormPasswordInput: FC<FormInputProps> = ({ name, ...rest }) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { ref, onChange, onBlur, name: controllerName, value }, fieldState: { error } }) => (
                <PasswordInput
                    {...rest}
                    value={value}
                    name={controllerName}
                    onBlur={onBlur}
                    onChange={onChange}
                    errorMessage={error?.message}
                    formRef={ref}
                />
            )}
        />
    );
};

export default FormPasswordInput;
