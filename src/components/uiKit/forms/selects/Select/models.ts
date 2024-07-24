// libs
import { ReactNode } from "react";
import { ActionMeta, MenuPlacement, MenuPosition, OnChangeValue } from "react-select/dist/declarations/src/types";
import { RefCallBack } from "react-hook-form";

export interface MaybeDisabledOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

export type DisabledOption<Option> = Option & MaybeDisabledOption;

export interface SelectProps<Option> {
    className?: string;
    label?: string | ReactNode;
    options: Option[] | DisabledOption<Option>[];
    disabled?: boolean;
    name?: string;
    onChange?: (newValue: OnChangeValue<Option, false>, actionMeta: ActionMeta<Option>) => void;
    errorMessage?: string;
    defaultValue?: Option;
    value?: Option;
    menuPlacement?: MenuPlacement;
    menuPosition?: MenuPosition;
    placeholder?: string;
    clearable?: boolean;
    isFilter?: boolean;
    tabSelectsValue?: boolean;
    formRef?: RefCallBack;
    maxWidth?: string;
    autoFocus?: boolean;
    isLoading?: boolean;
}

export interface FormSelectProps<Option> extends Omit<SelectProps<Option>, "name" | "errorMessage"> {
    name: string;
}
