// libs
import React, { FC } from "react";
import { observer } from "mobx-react";

// constants
import { MAX_SEARCH_STRING_LENGTH, MIN_SEARCH_STRING_LENGTH } from "../../../../../../../../shared/constants/filters";

// helpers
import { deepTrim } from "../../../../../../../../shared/utils/string";
import { showWarningToast } from "../../../../../../../../components/uiKit/Toast/helpers";

// models
import { TemplatesSearchInputProps } from "../../../../../../models";

// stores
import { useTemplatesStore } from "../../../../../../store";

// components
import FormSearchField from "../../../../../../../../components/uiKit/SearchField/FormSearchField";
import { getValidationMessage } from "../../../../../../../../shared/utils/filters";

const TemplatesSearchInput: FC<TemplatesSearchInputProps> = ({
    name,
    placeholder,
    min = MIN_SEARCH_STRING_LENGTH,
    max = MAX_SEARCH_STRING_LENGTH,
    ...rest
}) => {
    const {
        templatesStore: { setTemplatesFilterValue },
    } = useTemplatesStore();

    const onFilterChange = (value: string) => {
        const trimValue = deepTrim(value) as string;
        const validationMessage = getValidationMessage(trimValue, min, max);
        if (!validationMessage) {
            setTemplatesFilterValue(name, trimValue);
        } else {
            showWarningToast({ title: "Validation", message: validationMessage });
        }
    };

    const onFilterReset = () => {
        setTemplatesFilterValue(name, "");
    };

    return (
        <FormSearchField
            name={name}
            placeholder={placeholder}
            onChange={onFilterChange}
            onReset={onFilterReset}
            isFilter
            {...rest}
        />
    );
};

export default observer(TemplatesSearchInput);
