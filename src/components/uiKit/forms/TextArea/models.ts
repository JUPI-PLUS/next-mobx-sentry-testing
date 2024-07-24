import { ChangeEventHandler, FocusEventHandler } from "react";
import { RefCallBack } from "react-hook-form";

export interface TextAreaProps {
    value?: string;
    name?: string;
    label?: string;
    errorMessage?: string;
    disabled?: boolean;
    placeholder?: string;
    containerClassName?: string;
    defaultValue?: string;
    maxLength?: number;
    autoFocus?: boolean;
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    onBlur?: FocusEventHandler<HTMLTextAreaElement>;
    formRef?: RefCallBack;
}

export interface FormTextAreaProps extends Omit<TextAreaProps, "name" | "errorMessage"> {
    name: string;
}
