// libs
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";

// models
import { ExaminationSearchInputProps } from "./models";

// components
import FormSearchField from "../../../../../components/uiKit/SearchField/FormSearchField";

const ExaminationSearchInput: FC<ExaminationSearchInputProps> = ({
    onFieldChange,
    fieldName,
    placeholder,
    className,
}) => {
    const { trigger, clearErrors } = useFormContext();

    const onFilterChange = async (value: string) => {
        const result = await trigger(fieldName);
        if (result) {
            onFieldChange(fieldName, value);
        }
    };
    const onFilterReset = () => {
        onFieldChange(fieldName, "");
        clearErrors(fieldName);
    };
    return (
        <FormSearchField
            containerClassName={className}
            name={fieldName}
            placeholder={placeholder}
            onChange={onFilterChange}
            onReset={onFilterReset}
            isFilter
        />
    );
};
export default ExaminationSearchInput;
