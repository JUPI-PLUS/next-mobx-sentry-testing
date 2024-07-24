// models
import { InputProps } from "../../CommonInput/models";

export interface FormMaskedInputProps extends Omit<InputProps, "name" | "errorMessage"> {
    defaultValue?: string;
    name: string;
}

export interface FormRegExpMaskedInputProps extends FormMaskedInputProps {
    mask: RegExp;
}
