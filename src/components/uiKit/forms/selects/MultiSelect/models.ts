import { SelectProps } from "../Select/models";
import { ActionMeta, OnChangeValue } from "react-select/dist/declarations/src/types";

export type MultiselectChangeValue<Option> = OnChangeValue<Option, true>;

export interface MultiSelectProps<Option> extends Omit<SelectProps<Option>, "onChange" | "value"> {
    onChange?: (newValue: MultiselectChangeValue<Option>, actionMeta: ActionMeta<Option>) => void;
    value: Option[];
    isScrollable?: boolean;
    maxScrollableHeight?: string;
}

export interface FormMultiSelectProps<Option> extends Omit<SelectProps<Option>, "name" | "onChange" | "errorMessage"> {
    onChange?: (newValue: MultiselectChangeValue<Option>, actionMeta: ActionMeta<Option>) => void;
    name: string;
    isScrollable?: boolean;
    maxScrollableHeight?: string;
}
