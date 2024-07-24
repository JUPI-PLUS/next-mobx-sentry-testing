import React, { FC, useCallback } from "react";
import { FormInputProps } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import Input from "./Input";

const FormInput: FC<FormInputProps> = ({ name, onChange, defaultValue, ...rest }) => {
    const { control } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                    onChange(e);
                }

                controllerCallback(e.target.value);
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
                field: { ref, onChange: onFormFieldChange, onBlur, name: controllerName, value },
                fieldState: { error },
            }) => (
                <Input
                    {...rest}
                    value={value}
                    name={controllerName}
                    onBlur={onBlur}
                    onChange={onFieldChange(onFormFieldChange)}
                    errorMessage={error?.message}
                    formRef={ref}
                />
            )}
        />
    );
};

export default FormInput;
