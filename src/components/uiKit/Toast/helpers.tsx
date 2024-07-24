import { toast, TypeOptions } from "react-toastify";
import ToastContent from "./ToastContent";
import { ToastContentProps } from "./models";

export const getToastProgressClassName = (type?: TypeOptions) => {
    switch (type) {
        case "error":
            return "bg-red-100";
        case "warning":
            return "bg-yellow-100";
        case "success":
        default:
            return "bg-green-100";
    }
};

export const showSuccessToast = (contentProps: ToastContentProps) =>
    toast.success(({ toastProps }) => <ToastContent {...contentProps} {...toastProps} />);

export const showErrorToast = (contentProps: ToastContentProps) =>
    toast.error(({ toastProps }) => <ToastContent {...contentProps} {...toastProps} />);

export const showWarningToast = (contentProps: ToastContentProps) =>
    toast.warn(({ toastProps }) => <ToastContent {...contentProps} {...toastProps} />);
