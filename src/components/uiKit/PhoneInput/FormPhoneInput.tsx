import React, { FC, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormPhoneInputProps } from "./models";
import PhoneInput from "./PhoneInput";

const FormPhoneInput: FC<FormPhoneInputProps> = ({ name, onChange, defaultValue, ...rest }) => {
    const { control } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (phone: string) => {
                if (onChange) {
                    onChange(phone);
                }

                controllerCallback(phone);
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
                <PhoneInput
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

export default FormPhoneInput;
