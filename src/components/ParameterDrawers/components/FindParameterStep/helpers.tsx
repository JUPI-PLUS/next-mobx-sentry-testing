//  libs
import { GroupBase, Options, OptionsOrGroups } from "react-select/dist/declarations/src/types";
import { Accessors } from "react-select/dist/declarations/src/useCreatable";

//  helpers
import { isValidNewOption } from "../../../uiKit/forms/selects/utils";

//  models
import { LoadParameterOption } from "./models";
import { Parameter } from "../../../../shared/models/business/parameter";

//  constants
import { MAX_PARAMETER_CODE_SEARCH_INPUT_LENGTH, MIN_PARAMETER_CODE_SEARCH_INPUT_LENGTH } from "./constants";

export const getParametersOptions = (data: Parameter[], pickedParamsUUID: string[]) =>
    data.reduce<LoadParameterOption[]>((acc, { id, uuid, code, name }) => {
        return pickedParamsUUID.includes(uuid) ? acc : [...acc, { value: code, uuid, label: `${code} - ${name}`, id }];
    }, []);

export const canCreateParameter = <Option,>(
    inputValue: string,
    value: Options<Option>,
    options: OptionsOrGroups<Option, GroupBase<Option>>,
    accessors: Accessors<Option>
): boolean =>
    isValidNewOption(inputValue, value, options, accessors)
        ? inputValue.length >= MIN_PARAMETER_CODE_SEARCH_INPUT_LENGTH &&
          inputValue.length <= MAX_PARAMETER_CODE_SEARCH_INPUT_LENGTH
        : false;
