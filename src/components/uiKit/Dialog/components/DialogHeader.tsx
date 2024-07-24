import React, { FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DialogProps } from "../models";
import { IconButton } from "../../Button/Button";
import useEsc from "../../../../shared/hooks/useEsc";

const DialogHeader: FC<Pick<DialogProps, "title" | "onClose" | "couldCloseOnEsc">> = ({
    title,
    onClose,
    couldCloseOnEsc,
}) => {
    useEsc(couldCloseOnEsc ? onClose : () => {});

    return (
        <div className="flex items-center justify-between mb-6 font-bold text-xl text-dark-900">
            {title && <div>{title}</div>}
            <IconButton
                aria-label="Close dialog"
                className="hover:bg-inherit flex items-center justify-center absolute top-3 right-3 w-10 h-10"
                data-testid="close-dialog-button"
                size="sm"
                onClick={onClose}
                variant="neutral"
            >
                <XMarkIcon className="w-4 h-4 text-dark-900" />
            </IconButton>
        </div>
    );
};

export default DialogHeader;
