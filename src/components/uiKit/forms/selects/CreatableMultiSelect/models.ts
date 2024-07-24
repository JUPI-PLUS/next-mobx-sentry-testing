import { SelectProps } from "../Select/models";
import { ActionMeta, OnChangeValue } from "react-select/dist/declarations/src/types";

export interface MultiSelectProps<Option> extends Omit<SelectProps<Option>, "onChange"> {
    onChange?: (newValue: OnChangeValue<Option, true>, actionMeta: ActionMeta<Option>) => void;
}

export interface FormMultiSelectProps<Option> extends Omit<SelectProps<Option>, "name" | "onChange" | "errorMessage"> {
    name: string;
}
