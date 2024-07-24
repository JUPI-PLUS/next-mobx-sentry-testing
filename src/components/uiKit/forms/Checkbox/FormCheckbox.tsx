import React, { FC, useCallback } from "react";
import { FormCheckboxProps } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import Checkbox from "./Checkbox";

const FormCheckbox: FC<FormCheckboxProps> = ({ name, onChange, ...rest }) => {
    const { control } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                if (onChange) {
                    onChange(e);
                }

                controllerCallback(e.target.checked);
            };
        },
        [onChange]
    );

    return (
        <Controller
            control={control}
            name={name}
            render={({
                field: { onChange: onFormFieldChange, name: controllerName, value },
                fieldState: { error },
            }) => (
                <Checkbox
                    {...rest}
                    value={value}
                    checked={value}
                    name={controllerName}
                    onChange={onFieldChange(onFormFieldChange)}
                    errorMessage={error?.message}
                />
            )}
        />
    );
};

export default FormCheckbox;
