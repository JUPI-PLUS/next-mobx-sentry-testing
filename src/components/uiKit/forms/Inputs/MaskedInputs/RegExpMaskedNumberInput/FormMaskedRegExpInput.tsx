// libs
import React, { FC, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

// models
import { FormRegExpMaskedInputProps } from "../FormMaskedNumberInput/models";

// components
import MaskedRegExpInput from "./RegExpMaskedNumberInput";

const FormMaskedRegExpInput: FC<FormRegExpMaskedInputProps> = ({ name, onChange, defaultValue, label, ...rest }) => {
    const { control } = useFormContext();

    const onFieldInput = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                controllerCallback(e.target.value);

                if (onChange) {
                    onChange(e);
                }
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
                <MaskedRegExpInput
                    {...rest}
                    value={value}
                    name={controllerName}
                    onBlur={onBlur}
                    onInput={onFieldInput(onFormFieldChange)}
                    errorMessage={error?.message}
                    label={label as string}
                    formRef={ref}
                />
            )}
        />
    );
};

export default FormMaskedRegExpInput;
