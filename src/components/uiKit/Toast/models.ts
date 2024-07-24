import { ReactNode } from "react";
import { TypeOptions } from "react-toastify";

type TextField = string | ReactNode;

export interface ToastContentProps {
    title?: TextField;
    message?: TextField;
    actionText?: string;
    onAction?: () => void;
}

export interface ToastIconProps {
    type: TypeOptions | undefined;
}

export interface ToastHelperParams {
    message?: TextField;
    title?: TextField;
}
