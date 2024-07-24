// libs
import React, { FC, useCallback, useRef } from "react";

// models
import { DialogContainerProps } from "../models";

// hooks
import { useClickAway } from "../../../../shared/hooks/useClickAway";

const DialogContainer: FC<DialogContainerProps> = ({ className, children, onClose, couldCloseOnBackdrop }) => {
    const dialogContainerInner = useRef(null);

    const onClickAway = useCallback(() => {
        if (couldCloseOnBackdrop) {
            onClose();
        }
    }, [onClose, couldCloseOnBackdrop]);

    useClickAway(dialogContainerInner, onClickAway);

    return (
        <div
            data-testid="dialog-container"
            className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed z-50 inset-0 min-w-1/4"
        >
            <div
                ref={dialogContainerInner}
                className={`relative w-full bg-white rounded-xl overflow-hidden flex flex-col shadow-card-shadow ${
                    className || "max-w-sm"
                }`}
                data-testid="dialog-inner-container"
            >
                <div className="p-8 rounded shadow relative flex flex-col w-full bg-white overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DialogContainer;
