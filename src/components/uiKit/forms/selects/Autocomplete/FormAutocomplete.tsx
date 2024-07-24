import { FormAutocompleteProps } from "./models";
import { Controller, useFormContext } from "react-hook-form";
import Autocomplete from "./Autocomplete";

const FormAutocomplete = <Option,>({ name, ...rest }: FormAutocompleteProps<Option>) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { ref, onChange, name: controllerName, value }, fieldState: { error } }) => (
                <Autocomplete<Option>
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

export default FormAutocomplete;
