import { FormMultiSelectProps } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import CreatableMultiSelect from "./CreatableMultiSelect";
import { MaybeDisabledOption } from "../Select/models";

const FormCreatableMultiSelect = <Option extends MaybeDisabledOption>({
    name,
    ...rest
}: FormMultiSelectProps<Option>) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { ref, onChange, name: controllerName, value }, fieldState: { error } }) => (
                <CreatableMultiSelect<Option>
                    {...rest}
                    name={controllerName}
                    value={value}
                    onChange={onChange}
                    errorMessage={error?.message}
                    formRef={ref}
                />
            )}
        />
    );
};

export default FormCreatableMultiSelect;
