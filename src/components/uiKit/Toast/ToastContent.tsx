import React from "react";
import { ToastContentProps } from "./models";
import { ToastProps } from "react-toastify/dist/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ToastIcon from "./ToastIcon";
import { TextButton } from "../Button/Button";

const ToastContent = ({
    message,
    title,
    type,
    closeToast,
    actionText = "",
    onAction,
}: ToastContentProps & Partial<ToastProps>) => {
    return (
        <div className="flex justify-between items-center" data-testid={`toast-${type}-container`}>
            <ToastIcon type={type} />
            <div className="grow flex flex-col gap-y-2 mr-4">
                {title && (
                    <h2 data-testid="toast-title" className="text-dark-900 text-lg font-bold">
                        {title}
                    </h2>
                )}
                {message && (
                    <p data-testid="toast-message" className="text-dark-800 text-md">
                        {message}
                    </p>
                )}
                {actionText && (
                    <div>
                        <TextButton
                            text={actionText}
                            onClick={onAction}
                            size="thin"
                            variant="transparent"
                            className="text-md text-dark-900 underline font-normal decoration-0.5 underline-offset-2"
                        />
                    </div>
                )}
            </div>
            <XMarkIcon
                data-testid="toast-close-btn"
                className="w-5 h-5 shrink-0 text-gray-60 hover:text-gray-90 text-dark-900 cursor-pointer"
                onClick={closeToast}
            />
        </div>
    );
};

export default ToastContent;
