import { ChangeEventHandler, ForwardedRef, RefObject } from "react";

export interface CustomInputRef {
    current: ForwardedRef<HTMLInputElement>;
}
export interface CheckboxProps {
    name?: string;
    label?: string;
    value?: string | number;
    checkboxRef?: RefObject<HTMLInputElement>;
    checked?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    className?: string;
}

export interface CheckboxIconsProps {
    checked: boolean | undefined;
    checkboxValue: string | IndeterminateCheckboxValues | undefined;
}

export interface FormCheckboxProps extends Omit<CheckboxProps, "name" | "value" | "defaultChecked" | "errorMessage"> {
    name: string;
}

export enum IndeterminateCheckboxValues {
    Checked = 1,
    Indeterminate = 2,
    Empty = 3,
}

export interface IndeterminateCheckboxProps extends CheckboxProps {
    value?: IndeterminateCheckboxValues;
}
