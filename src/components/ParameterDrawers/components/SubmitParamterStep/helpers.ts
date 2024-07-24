//  libs
import { GroupBase, Options, OptionsOrGroups } from "react-select/dist/declarations/src/types";
import { Accessors } from "react-select/dist/declarations/src/useCreatable";

//  helpers
import { isValidNewOption } from "../../../uiKit/forms/selects/utils";

//  constants
import { MAX_CREATE_OPTION_INPUT_LENGTH, MIN_CREATE_OPTION_INPUT_LENGTH } from "./constants";

export const canCreateOption =
    <Option>(isValid: boolean) =>
    (
        inputValue: string,
        value: Options<Option>,
        options: OptionsOrGroups<Option, GroupBase<Option>>,
        accessors: Accessors<Option>
    ): boolean =>
        isValidNewOption(inputValue, value, options, accessors)
            ? isValid &&
              inputValue.length >= MIN_CREATE_OPTION_INPUT_LENGTH &&
              inputValue.length <= MAX_CREATE_OPTION_INPUT_LENGTH
            : false;
