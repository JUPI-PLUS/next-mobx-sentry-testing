// libs
import React, { FC, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import IMask from "imask";

// models
import { FormMaskedInputProps } from "./models";

// constants
import { COMMA_SEPARATOR, MAX_SAFE_INTEGER } from "../../../../../../shared/constants/common";

// components
import MaskedNumberInput from "./MaskedNumberInput";

const FormMaskedNumberInput: FC<FormMaskedInputProps & IMask.MaskedNumberOptions> = ({
    name,
    onChange,
    defaultValue,
    label,
    ...rest
}) => {
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
                <MaskedNumberInput
                    overwrite={false}
                    scale={0}
                    signed={false}
                    padFractionalZeros={false}
                    normalizeZeros={true}
                    radix="."
                    mapToRadix={[COMMA_SEPARATOR]}
                    min={0}
                    max={MAX_SAFE_INTEGER}
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

export default FormMaskedNumberInput;
