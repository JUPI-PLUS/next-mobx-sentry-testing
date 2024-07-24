import { ChangeEventHandler, FocusEventHandler, MouseEventHandler, ReactNode } from "react";
import { RefCallBack } from "react-hook-form";

export type InputType = "text" | "password" | "email" | "file" | "number";

export interface InputProps {
    value?: string;
    name?: string;
    label?: string | ReactNode;
    readOnly?: boolean;
    type?: InputType;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    errorMessage?: string;
    disabled?: boolean;
    placeholder?: string;
    inputClassName?: string;
    containerClassName?: string;
    accept?: string;
    autoFocus?: boolean;
    maxLength?: number;
    isFilter?: boolean;
    onClick?: MouseEventHandler<HTMLInputElement>;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    formRef?: RefCallBack;
}

export interface FormInputProps extends Omit<InputProps, "name" | "errorMessage"> {
    defaultValue?: string;
    name: string;
}
