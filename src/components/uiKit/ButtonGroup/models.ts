import { ReactElement } from "react";
import { ButtonProps, ButtonSize, ButtonVariant, IconButtonProps } from "../Button/models";

export type GroupButtonOrientation = "vertical" | "horizontal";
export type GroupButtonChildren = Array<ReactElement<ButtonProps | IconButtonProps>>;

export interface AdditionalGroupButtonProps {
    size: ButtonSize | undefined;
    variant: ButtonVariant | undefined;
}

export interface ButtonGroupProps {
    size?: ButtonSize;
    variant?: ButtonVariant;
    className?: string;
    orientation?: GroupButtonOrientation;
    children: GroupButtonChildren;
}
