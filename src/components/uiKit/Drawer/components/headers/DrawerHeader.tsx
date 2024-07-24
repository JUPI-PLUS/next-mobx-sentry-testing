import React, { FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { DrawerHeaderProps } from "../../models";
import useEsc from "../../../../../shared/hooks/useEsc";
import { IconButton } from "../../../Button/Button";

const DrawerHeader: FC<DrawerHeaderProps> = ({
    title,
    onClose,
    couldCloseOnEsc,
    headerButton,
    closeButtonDisabled,
}) => {
    useEsc(couldCloseOnEsc ? onClose : () => {});

    return (
        <div className="flex items-center px-5 py-4 border-b relative text-center">
            <IconButton
                aria-label="Close drawer"
                variant="transparent"
                className="-ml-2 mr-auto"
                size="thin"
                onClick={onClose}
                disabled={closeButtonDisabled}
                data-testid="close-drawer-button"
            >
                <XMarkIcon className="w-5 h-5 mr-auto text-dark-900" />
            </IconButton>

            {title && (
                <p data-testid="drawer-title" className="mr-auto text-md font-bold">
                    {title}
                </p>
            )}
            {headerButton}
        </div>
    );
};

export default DrawerHeader;
