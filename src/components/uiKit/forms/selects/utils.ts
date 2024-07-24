//  libs
import { Theme } from "react-select";
import { Accessors } from "react-select/dist/declarations/src/useCreatable";
import { GroupBase, Options, OptionsOrGroups } from "react-select/dist/declarations/src/types";

export const getTheme = (theme: Theme) => ({
    ...theme,
    borderRadius: 8,
    colors: {
        ...theme.colors,
        primary: "rgba(7, 23, 48, 1)",
        primary50: "rgba(7, 23, 48, 0.24)",
        primary25: "rgba(7, 23, 48, 0.04)",
        neutral20: "rgba(7, 23, 48, 0.32)",
    },
});

export const getSelectClassName = <Option>(value?: Option | Option[], isFilter?: boolean) => {
    if (Array.isArray(value)) {
        return isFilter && value.length ? "has-value" : "";
    }
    return isFilter && value ? "has-value" : "";
};

export const getSelectIconClassName = (hasValue: boolean, isFocused: boolean, isFilter?: boolean) => {
    if ((isFilter && hasValue) || isFocused) {
        return "text-dark-900";
    }

    return "text-dark-700";
};

export const compareOption = <Option>(option: Option, accessors: Accessors<Option>, inputValue = "") => {
    const candidate = String(inputValue).toLowerCase();
    const optionValue = String(accessors.getOptionValue(option)).toLowerCase();
    const optionLabel = String(accessors.getOptionLabel(option)).toLowerCase();
    return optionValue === candidate || optionLabel === candidate;
};

export const isValidNewOption = <Option>(
    inputValue: string,
    value: Options<Option>,
    options: OptionsOrGroups<Option, GroupBase<Option>>,
    accessors: Accessors<Option>
) => {
    return !(
        !inputValue ||
        value.some(option => compareOption(option, accessors, inputValue)) ||
        options.some(option => compareOption(option as Option, accessors, inputValue))
    );
};
