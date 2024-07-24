//  libs
import {
    ActionMeta,
    GroupBase,
    InputActionMeta,
    MenuPlacement,
    OnChangeValue,
    Options,
    OptionsOrGroups,
    SingleValue,
} from "react-select/dist/declarations/src/types";
import { RefCallBack } from "react-hook-form";
import { Accessors } from "react-select/dist/declarations/src/useCreatable";

export interface AutocompleteProps<Option> {
    label?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    errorMessage?: string;
    value?: SingleValue<Option>;
    defaultValue?: SingleValue<Option>;
    formRef?: RefCallBack;
    hint?: string;
    menuIsOpen?: boolean;
    autoFocus?: boolean;
    defaultOptions?: Options<Option> | boolean;
    minMenuHeight?: number;
    maxMenuHeight?: number;
    menuPlacement?: MenuPlacement;
    loadOptions?: (inputValue: string, callback: (options: Options<Option>) => void) => Promise<Options<Option>> | void;
    onChange?: (newValue: OnChangeValue<Option, false>, actionMeta: ActionMeta<Option>) => void;
    onInputChange?: (newValue: string, actionMeta: InputActionMeta) => void;
    className?: string;
    selectClassName?: string;
    isClearable?: boolean;
    isValidNewOption?: (
        inputValue: string,
        value: Options<Option>,
        options: OptionsOrGroups<Option, GroupBase<Option>>,
        accessors: Accessors<Option>
    ) => boolean;
}

export interface FormAutocompleteProps<Option>
    extends Omit<AutocompleteProps<Option>, "name" | "onChange" | "errorMessage"> {
    name: string;
}
