import React, { FC, useCallback } from "react";
import { FormSearchFiledProps } from "./models";
import SearchField from "./SearchField";
import { Controller, useFormContext } from "react-hook-form";

const FormSearchField: FC<FormSearchFiledProps> = ({ onChange, name, onReset, ...rest }) => {
    const { control, setValue } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (inputValue: string) => {
                // It can cast some bugs. We changed call order of onChange cbs. By Shevchenko
                controllerCallback(inputValue);

                if (onChange) {
                    onChange(inputValue);
                }
            };
        },
        [onChange]
    );

    const onResetValue = () => {
        setValue(name, "");
        onReset?.();
    };

    return (
        <Controller
            control={control}
            name={name}
            render={({
                fieldState: { error },
                field: { ref, onChange: onFormFieldChange, onBlur, name: controllerName, value },
            }) => (
                <SearchField
                    formRef={ref}
                    onReset={onResetValue}
                    name={controllerName}
                    value={value}
                    onChange={onFieldChange(onFormFieldChange)}
                    onBlur={onBlur}
                    errorMessage={error?.message}
                    {...rest}
                />
            )}
        />
    );
};

export default FormSearchField;
