import { ChangeEventHandler, MouseEventHandler } from "react";

export type RadioValue = string | number;

export type RadioOption = {
    label: string;
    value: RadioValue;
};

export interface RadioProps {
    name?: string;
    label?: string;
    value?: RadioValue;
    checked: boolean;
    disabled?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onClick?: MouseEventHandler<HTMLInputElement>;
    className?: string;
    iconClassName?: string;
}
