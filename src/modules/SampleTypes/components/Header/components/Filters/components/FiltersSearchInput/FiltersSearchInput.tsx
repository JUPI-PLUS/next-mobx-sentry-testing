// libs
import { FC } from "react";

// models
import { SampleTypesFilterSearchInputProps } from "../../../../../../models";

// components
import FormSearchField from "../../../../../../../../components/uiKit/SearchField/FormSearchField";

const FiltersSearchInput: FC<SampleTypesFilterSearchInputProps> = ({
    name,
    onChange,
    onReset,
    placeholder,
    autoFocus,
}) => {
    return (
        <FormSearchField
            name={name}
            onChange={onChange}
            onReset={onReset}
            placeholder={placeholder}
            data-testid="name-filter-input"
            containerClassName="max-w-xs w-full ml-auto"
            isFilter
            autoFocus={autoFocus}
        />
    );
};

export default FiltersSearchInput;
