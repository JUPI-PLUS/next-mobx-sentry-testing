import { InputProps } from "../forms/Inputs/CommonInput/models";

export interface SearchFiledProps extends Omit<InputProps, "onChange"> {
    onChange: (value: string) => void;
    onReset: () => void;
    shouldReset?: boolean;
}

export interface FormSearchFiledProps extends Omit<SearchFiledProps, "onReset" | "onChange"> {
    onChange?: (value: string) => void;
    onReset?: () => void;
    name: string;
}
