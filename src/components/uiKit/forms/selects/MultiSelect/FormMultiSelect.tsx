import { FormMultiSelectProps, MultiselectChangeValue } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import MultiSelect from "./MultiSelect";
import { useCallback } from "react";
import { ActionMeta } from "react-select/dist/declarations/src/types";
import { MaybeDisabledOption } from "../Select/models";

const FormMultiSelect = <Option extends MaybeDisabledOption>({
    name,
    onChange,
    ...rest
}: FormMultiSelectProps<Option>) => {
    const { control } = useFormContext();

    const onFieldChange = useCallback(
        (controllerCallback: (...event: unknown[]) => void) => {
            return (value: MultiselectChangeValue<Option>, action: ActionMeta<Option>) => {
                onChange?.(value, action);
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
                <MultiSelect<Option>
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

export default FormMultiSelect;
