import React, { FC } from "react";
import { FormToggleProps } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import Checkbox from "./Toggle";

const FormToggle: FC<FormToggleProps> = ({ name, ...rest }) => {
    const { control } = useFormContext();
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, name: controllerName, value }, fieldState: { error } }) => (
                <Checkbox
                    {...rest}
                    checked={value}
                    value={value}
                    name={controllerName}
                    onChange={onChange}
                    errorMessage={error?.message}
                />
            )}
        />
    );
};

export default FormToggle;
