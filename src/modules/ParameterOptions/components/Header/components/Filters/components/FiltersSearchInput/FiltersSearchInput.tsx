import { observer } from "mobx-react";
import FormSearchField from "../../../../../../../../components/uiKit/SearchField/FormSearchField";
import { useParameterOptionsStore } from "../../../../../../store";
import { FC } from "react";
import { ParameterOptionsSearchInputProps } from "../../../../models";
import { deepTrim } from "../../../../../../../../shared/utils/string";
import { showWarningToast } from "../../../../../../../../components/uiKit/Toast/helpers";
import { MAX_SEARCH_STRING_LENGTH, MIN_SEARCH_STRING_LENGTH } from "../../../../../../constants/filters";

const getValidationMessage = (filterValue: string, min: number, max: number) => {
    const isNumberLengthValid = filterValue.length >= min && filterValue.length <= max;
    if (!isNumberLengthValid) return `Min symbols ${min}${max ? `and max symbols ${max} symbols` : ""}`;
    return "";
};

const FiltersSearchInput: FC<ParameterOptionsSearchInputProps> = ({
    name,
    placeholder,
    min = MIN_SEARCH_STRING_LENGTH,
    max = MAX_SEARCH_STRING_LENGTH,
    autoFocus,
}) => {
    const {
        parameterOptionsStore: { setupParameterOptionsFilter },
    } = useParameterOptionsStore();

    const onChange = (value: string) => {
        const trimmedValue = deepTrim(value) as string;
        if (trimmedValue.length === 0) {
            setupParameterOptionsFilter("name", "");
            return;
        }

        const validationMessage = getValidationMessage(trimmedValue, min, max);
        if (!validationMessage) {
            setupParameterOptionsFilter("name", trimmedValue);
        } else {
            showWarningToast({ title: "Validation", message: validationMessage });
        }
    };

    const onReset = () => setupParameterOptionsFilter("name", "");

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

export default observer(FiltersSearchInput);
