import { FormCreatableSelectProps } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import CreatableSelect from "./CreatableSelect";
import { MaybeDisabledOption } from "../Select/models";
import { useCallback } from "react";
import { ActionMeta, OnChangeValue } from "react-select";

const FormCreatableSelect = <Option extends MaybeDisabledOption>({
    name,
    onChange,
    ...rest
}: FormCreatableSelectProps<Option>) => {
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
                <CreatableSelect<Option>
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

export default FormCreatableSelect;
