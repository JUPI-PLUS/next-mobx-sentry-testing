// libs
import { useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ActionMeta, OnChangeValue } from "react-select";

// models
import { FormCreatableSelectProps } from "../../../../../../../../../../components/uiKit/forms/selects/CreatableSelect/models";
import { MaybeDisabledOption } from "../../../../../../../../../../components/uiKit/forms/selects/Select/models";

// components
import UnstrictDropdownSelect from "./UnstrictDropdownSelect";

const FormUnstrictDropdownSelect = <Option extends MaybeDisabledOption>({
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
                <UnstrictDropdownSelect<Option>
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

export default FormUnstrictDropdownSelect;
