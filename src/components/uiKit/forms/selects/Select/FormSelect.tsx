import { FormSelectProps, MaybeDisabledOption } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import Select from "./Select";
import { ActionMeta, OnChangeValue } from "react-select/dist/declarations/src/types";
import { useCallback } from "react";

const FormSelect = <Option extends MaybeDisabledOption>({ name, onChange, ...rest }: FormSelectProps<Option>) => {
    const { control } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (value: OnChangeValue<Option, false>, actionMeta: ActionMeta<Option>) => {
                if (onChange) {
                    onChange(value, actionMeta);
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
            render={({
                field: { ref, onChange: onFormFieldChange, name: controllerName, value },
                fieldState: { error },
            }) => (
                <Select<Option>
                    {...rest}
                    name={controllerName}
                    value={value}
                    onChange={onFieldChange(onFormFieldChange)}
                    errorMessage={error?.message}
                    formRef={ref}
                />
            )}
        />
    );
};

export default FormSelect;
