import { SelectProps } from "../Select/models";
import { ActionMeta, OnChangeValue } from "react-select/dist/declarations/src/types";

export interface CreatableSelectProps<Option> extends Omit<SelectProps<Option>, "onChange"> {
    onChange?: (newValue: OnChangeValue<Option, false>, actionMeta: ActionMeta<Option>) => void;
}

export interface FormCreatableSelectProps<Option> extends Omit<SelectProps<Option>, "name" | "errorMessage"> {
    name: string;
}
