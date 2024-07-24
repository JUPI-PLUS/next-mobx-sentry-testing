import { MouseEventHandler } from "react";

export type ButtonVariant = "primary" | "error" | "warning" | "neutral" | "transparent";
export type ButtonSize = "thin" | "xs" | "sm" | "md" | "lg";

export interface ButtonProps {
    className?: string;
    type?: "submit" | "reset" | "button";
    disabled?: boolean;
    text?: string | number;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    onMiddleMouseClick?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export interface IconButtonProps extends Omit<ButtonProps, "text" | "startIcon" | "endIcon"> {
    children: JSX.Element;
}
