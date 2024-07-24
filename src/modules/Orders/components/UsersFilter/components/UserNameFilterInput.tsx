// libs
import React from "react";
import { useFormContext } from "react-hook-form";

// models
import { UserNameFilterInputProps } from "./models";

// components
import FormSearchField from "../../../../../components/uiKit/SearchField/FormSearchField";

const UserNameFilterInput = <T extends Record<keyof T, unknown>>({
    onFieldChange,
    fieldName,
    placeholder,
    className,
    ...rest
}: UserNameFilterInputProps<T>) => {
    const { trigger, clearErrors } = useFormContext();

    const onFilterChange = async (value: string) => {
        const result = await trigger(fieldName as string);
        if (result) {
            onFieldChange(fieldName, value);
        }
    };
    const onFilterReset = () => {
        onFieldChange(fieldName, "");
        clearErrors(fieldName as string);
    };
    return (
        <FormSearchField
            containerClassName={className}
            name={fieldName as string}
            placeholder={placeholder}
            onChange={onFilterChange}
            onReset={onFilterReset}
            isFilter
            {...rest}
        />
    );
};
export default UserNameFilterInput;
