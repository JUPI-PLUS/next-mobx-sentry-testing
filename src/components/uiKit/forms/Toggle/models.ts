import { ChangeEventHandler, ReactNode } from "react";

export interface ToggleProps {
    name?: string;
    label?: string | ReactNode;
    labelPosition?: "end" | "start";
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    containerClass?: string;
}

export interface FormToggleProps
    extends Omit<ToggleProps, "name" | "value" | "defaultChecked" | "errorMessage" | "onChange"> {
    name: string;
}
