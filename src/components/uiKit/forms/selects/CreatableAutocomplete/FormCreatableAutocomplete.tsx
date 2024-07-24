//  libs
import { Controller, useFormContext } from "react-hook-form";

//  models
import { FormCreatableAutocompleteProps } from "./models";

//  components
import CreatableAutocomplete from "./CreatableAutocomplete";

const FormCreatableAutocomplete = <Option,>({ name, ...rest }: FormCreatableAutocompleteProps<Option>) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { ref, onChange, name: controllerName, value }, fieldState: { error } }) => (
                <CreatableAutocomplete<Option>
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

export default FormCreatableAutocomplete;
