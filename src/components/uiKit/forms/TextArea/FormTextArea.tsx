import React, { FC, useCallback } from "react";
import { FormTextAreaProps } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import TextArea from "./TextArea";

const FormTextArea: FC<FormTextAreaProps> = ({ name, onChange, defaultValue, ...rest }) => {
    const { control } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                <TextArea
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

export default FormTextArea;
