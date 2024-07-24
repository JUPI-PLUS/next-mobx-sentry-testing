import { useFormContext } from "react-hook-form";
import FormSearchField from "../../../../../../../../../../components/uiKit/SearchField/FormSearchField";
import React from "react";
import { TemplatesFilterInputProps } from "./models";

const TemplatesFilterInput = ({ onChange, name, placeholder, className, ...rest }: TemplatesFilterInputProps) => {
    const { trigger, clearErrors } = useFormContext();

    const onFilterChange = async (value: string) => {
        const result = await trigger(name);
        if (result) {
            onChange(value);
        }
    };
    const onFilterReset = () => {
        onChange("");
        clearErrors(name);
    };

    return (
        <FormSearchField
            containerClassName={className}
            name={name as string}
            placeholder={placeholder}
            onChange={onFilterChange}
            onReset={onFilterReset}
            isFilter
            {...rest}
        />
    );
};

export default TemplatesFilterInput;
