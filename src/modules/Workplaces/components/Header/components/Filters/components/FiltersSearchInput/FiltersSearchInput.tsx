// libs
import React from "react";
import { useFormContext } from "react-hook-form";

// models
import { FiltersSearchInputProps } from "./models";

// components
import { showWarningToast } from "../../../../../../../../components/uiKit/Toast/helpers";
import FormSearchField from "../../../../../../../../components/uiKit/SearchField/FormSearchField";

const FiltersSearchInput = ({ onChange, name, className, ...rest }: FiltersSearchInputProps) => {
    const { trigger, clearErrors, getFieldState } = useFormContext();

    const onFilterChange = async (value: string) => {
        const result = await trigger(name);
        if (result) {
            onChange(value);
            return;
        }
        const { error } = getFieldState(name);
        showWarningToast({ title: "Validation", message: error!.message });
        clearErrors(name);
    };

    return <FormSearchField containerClassName={className} name={name} onChange={onFilterChange} isFilter {...rest} />;
};

export default FiltersSearchInput;
